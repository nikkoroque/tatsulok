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
exports.getInventoryTransactions = exports.updateInventory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const VALID_TRANSACTION_TYPES = ['IN', 'OUT'];
const updateInventory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            // Get current product inventory
            const product = yield tx.products.findUnique({
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
            yield tx.products.update({
                where: { product_id: productId },
                data: { quantity: newQuantity }
            });
            // Create transaction record
            return yield tx.inventory_transactions.create({
                data: {
                    product_id: productId,
                    quantity,
                    transaction_type: transactionType,
                    remarks,
                    transaction_date: new Date()
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
exports.updateInventory = updateInventory;
const getInventoryTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.inventory_transactions.findMany({
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
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
});
exports.getInventoryTransactions = getInventoryTransactions;
