"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryTransactions = exports.voidTransaction = exports.updateTransaction = exports.getTransaction = exports.createTransaction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const VALID_TRANSACTION_TYPES = ['IN', 'OUT', 'SALE', 'RETURN'];
// Helper function to adjust inventory
const adjustInventory = (tx, adjustment) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield tx.products.findUnique({
        where: { product_id: adjustment.productId },
        select: { quantity: true }
    });
    if (!product) {
        throw new Error('Product not found');
    }
    let newQuantity;
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
    yield tx.products.update({
        where: { product_id: adjustment.productId },
        data: {
            quantity: newQuantity,
            updated_at: new Date()
        }
    });
    return newQuantity;
});
// Create Transaction
const createTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Adjust inventory
            yield adjustInventory(tx, { productId, quantity, transactionType });
            // Create transaction record
            return yield tx.inventory_transactions.create({
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
        }));
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.createTransaction = createTransaction;
// Get single transaction
const getTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const transaction = yield prisma.inventory_transactions.findUnique({
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
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.getTransaction = getTransaction;
// Update Transaction
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { quantity: newQuantity, remarks } = req.body;
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Get original transaction
            const originalTransaction = yield tx.inventory_transactions.findUnique({
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
                yield adjustInventory(tx, {
                    productId: originalTransaction.product_id,
                    quantity: originalTransaction.quantity,
                    transactionType: reverseTransactionType(originalTransaction.transaction_type)
                });
                // Apply new transaction
                yield adjustInventory(tx, {
                    productId: originalTransaction.product_id,
                    quantity: newQuantity,
                    transactionType: originalTransaction.transaction_type
                });
            }
            // Update transaction record
            return yield tx.inventory_transactions.update({
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
        }));
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.updateTransaction = updateTransaction;
// Helper function to get reverse transaction type
const reverseTransactionType = (type) => {
    switch (type) {
        case 'IN': return 'OUT';
        case 'OUT': return 'IN';
        case 'SALE': return 'RETURN';
        case 'RETURN': return 'SALE';
    }
};
// Void Transaction
const voidTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { voidReason } = req.body;
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const originalTransaction = yield tx.inventory_transactions.findUnique({
                where: { transaction_id: Number(id) }
            });
            if (!originalTransaction) {
                throw new Error('Transaction not found');
            }
            if (!originalTransaction.product_id || !originalTransaction.transaction_type) {
                throw new Error('Invalid transaction data');
            }
            const reversalType = reverseTransactionType(originalTransaction.transaction_type);
            // Create new reversal transaction
            const reversalTransaction = yield tx.inventory_transactions.create({
                data: {
                    product_id: originalTransaction.product_id,
                    quantity: originalTransaction.quantity,
                    transaction_type: reversalType,
                    remarks: `Reversal of Transaction #${id} - ${voidReason}`,
                    transaction_date: new Date()
                }
            });
            // Adjust inventory
            const newQuantity = yield adjustInventory(tx, {
                productId: originalTransaction.product_id,
                quantity: originalTransaction.quantity,
                transactionType: reversalType
            });
            // Update original transaction remarks
            yield tx.inventory_transactions.update({
                where: { transaction_id: Number(id) },
                data: {
                    remarks: `${originalTransaction.remarks || ''} [VOIDED: ${voidReason}, Reversal: #${reversalTransaction.transaction_id}]`
                }
            });
            // Return both transactions and final quantity
            const result = yield tx.inventory_transactions.findMany({
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
        }));
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.voidTransaction = voidTransaction;
// Get all transactions with filtering and pagination
const getInventoryTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.inventory_transactions.findMany({
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
    }
    catch (error) {
        res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});
exports.getInventoryTransactions = getInventoryTransactions;
