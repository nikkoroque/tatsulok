import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VALID_TRANSACTION_TYPES = ['IN', 'OUT'] as const
type TransactionType = typeof VALID_TRANSACTION_TYPES[number]

export const updateInventory = async (req: Request, res: Response): Promise<void> => {
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
      // Get current product inventory
      const product = await tx.products.findUnique({
        where: { product_id: productId },
        select: { quantity: true }
      });

      if (!product) {
        throw new Error('Product not found');
      }

      // Calculate new quantity
      const newQuantity = transactionType === 'IN' 
        ? product.quantity + quantity
        : product.quantity - quantity;

      // Prevent negative inventory for OUT transactions
      if (transactionType === 'OUT' && newQuantity < 0) {
        throw new Error('Insufficient inventory');
      }

      // Update product quantity
      await tx.products.update({
        where: { product_id: productId },
        data: { quantity: newQuantity }
      });

      // Create transaction record
      return await tx.inventory_transactions.create({
        data: {
          product_id: productId,
          quantity,
          transaction_type: transactionType,
          remarks,
          transaction_date: new Date()
        }
      });
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
}

export const getInventoryTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await prisma.inventory_transactions.findMany({
      orderBy: {
        transaction_date: 'desc'
      },
      select: {
        transaction_id: true,
        product_id: true,
        quantity: true,
        transaction_type: true,
        remarks: true,
        transaction_date: true
      },
    });

    res.json(transactions);
  } catch (error) {
    res.status(400).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    });
  }
};