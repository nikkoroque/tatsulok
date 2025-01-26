import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VALID_TRANSACTION_TYPES = ['IN', 'OUT', 'SALE', 'RETURN'] as const
type TransactionType = typeof VALID_TRANSACTION_TYPES[number]

type InventoryAdjustment = {
  productId: number;
  quantity: number;
  transactionType: TransactionType;
};

// Update the type for transaction client
type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// Helper function to adjust inventory
const adjustInventory = async (
  tx: TransactionClient,
  adjustment: InventoryAdjustment
): Promise<number> => {
  const product = await tx.products.findUnique({
    where: { product_id: adjustment.productId },
    select: { quantity: true }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  let newQuantity: number;
  switch (adjustment.transactionType) {
    case 'IN':
    case 'RETURN':
      newQuantity = product.quantity + adjustment.quantity;
      break;
    case 'OUT':
    case 'SALE':
      newQuantity = product.quantity - adjustment.quantity;
      if (newQuantity < 0) {
        throw new Error('Insufficient inventory');
      }
      break;
    default:
      throw new Error('Invalid transaction type');
  }

  await tx.products.update({
    where: { product_id: adjustment.productId },
    data: { 
      quantity: newQuantity,
      updated_at: new Date()
    }
  });

  return newQuantity;
};

// Create Transaction
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, quantity, transactionType, remarks } = req.body;

    if (!VALID_TRANSACTION_TYPES.includes(transactionType)) {
      res.status(400).json({ error: 'Invalid transaction type' });
      return;
    }
    
    if (quantity <= 0) {
      res.status(400).json({ error: 'Quantity must be greater than 0' });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Adjust inventory
      await adjustInventory(tx, { productId, quantity, transactionType });

      // Create transaction record
      return await tx.inventory_transactions.create({
        data: {
          product_id: productId,
          quantity,
          transaction_type: transactionType,
          remarks,
          transaction_date: new Date()
        },
        include: {
          products: {
            select: {
              name: true,
              price: true,
              quantity: true
            }
          }
        }
      });
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

// Get single transaction
export const getTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const transaction = await prisma.inventory_transactions.findUnique({
      where: { transaction_id: Number(id) },
      include: {
        products: {
          select: {
            name: true,
            price: true,
            quantity: true,
            categories: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json(transaction);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

// Update Transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity: newQuantity, remarks } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Get original transaction
      const originalTransaction = await tx.inventory_transactions.findUnique({
        where: { transaction_id: Number(id) }
      });

      if (!originalTransaction) {
        throw new Error('Transaction not found');
      }

      if (!originalTransaction.product_id || !originalTransaction.transaction_type) {
        throw new Error('Invalid transaction data');
      }

      if (newQuantity) {
        // Reverse original transaction
        await adjustInventory(tx, {
          productId: originalTransaction.product_id,
          quantity: originalTransaction.quantity,
          transactionType: reverseTransactionType(originalTransaction.transaction_type as TransactionType)
        });

        // Apply new transaction
        await adjustInventory(tx, {
          productId: originalTransaction.product_id,
          quantity: newQuantity,
          transactionType: originalTransaction.transaction_type as TransactionType
        });
      }

      // Update transaction record
      return await tx.inventory_transactions.update({
        where: { transaction_id: Number(id) },
        data: {
          quantity: newQuantity || originalTransaction.quantity,
          remarks: remarks || originalTransaction.remarks,
          transaction_date: new Date()
        },
        include: {
          products: {
            select: {
              name: true,
              price: true,
              quantity: true
            }
          }
        }
      });
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

// Helper function to get reverse transaction type
const reverseTransactionType = (type: TransactionType): TransactionType => {
  switch (type) {
    case 'IN': return 'OUT';
    case 'OUT': return 'IN';
    case 'SALE': return 'RETURN';
    case 'RETURN': return 'SALE';
  }
};

// Void Transaction
export const voidTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { voidReason } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // First check if this transaction is already voided
      const originalTransaction = await tx.inventory_transactions.findUnique({
        where: { transaction_id: Number(id) }
      });

      if (!originalTransaction) {
        throw new Error('Transaction not found');
      }

      // Check if this transaction is already voided
      if (originalTransaction.remarks?.includes('[VOIDED:')) {
        throw new Error('Transaction has already been voided');
      }

      // Check if this transaction is a reversal transaction
      if (originalTransaction.remarks?.includes('Reversal of Transaction #')) {
        throw new Error('Cannot void a reversal transaction');
      }

      if (!originalTransaction.product_id || !originalTransaction.transaction_type) {
        throw new Error('Invalid transaction data');
      }

      const reversalType = reverseTransactionType(originalTransaction.transaction_type as TransactionType);

      // Create new reversal transaction
      const reversalTransaction = await tx.inventory_transactions.create({
        data: {
          product_id: originalTransaction.product_id,
          quantity: originalTransaction.quantity,
          transaction_type: reversalType,
          remarks: `Reversal of Transaction #${id} - ${voidReason}`,
          transaction_date: new Date()
        }
      });

      // Adjust inventory
      const newQuantity = await adjustInventory(tx, {
        productId: originalTransaction.product_id,
        quantity: originalTransaction.quantity,
        transactionType: reversalType
      });

      // Update original transaction remarks
      await tx.inventory_transactions.update({
        where: { transaction_id: Number(id) },
        data: {
          remarks: `${originalTransaction.remarks || ''} [VOIDED: ${voidReason}, Reversal: #${reversalTransaction.transaction_id}]`
        }
      });

      // Return both transactions and final quantity
      const result = await tx.inventory_transactions.findMany({
        where: {
          transaction_id: {
            in: [Number(id), reversalTransaction.transaction_id]
          }
        },
        include: {
          products: {
            select: {
              name: true,
              price: true,
              quantity: true
            }
          }
        },
        orderBy: {
          transaction_date: 'asc'
        }
      });

      return {
        originalTransaction: result[0],
        reversalTransaction: result[1],
        adjustedQuantity: newQuantity
      };
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};

// Get all transactions with filtering and pagination
export const getInventoryTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.inventory_transactions.findMany({
      orderBy: { transaction_date: 'desc' },
      select: {
        transaction_id: true,
        product_id: true,
        quantity: true,
        transaction_type: true,
        transaction_date: true,
        remarks: true
      },
    });
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
};
