import express from 'express';
import { updateInventory, getInventoryTransactions } from '../controller/transactionController';

const router = express.Router();

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new inventory transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *               - transactionType
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Quantity to add or remove
 *               transactionType:
 *                 type: string
 *                 enum: [IN, OUT]
 *                 description: Type of transaction
 *               transactionDate:
 *                 type: string
 *                 format: date-time
 *                 description: Date of the transaction
 *               remarks:
 *                 type: string
 *                 description: Optional notes about the transaction
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input or insufficient inventory
 */
router.post('/', updateInventory);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all inventory transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   transaction_id:
 *                     type: integer
 *                   product_id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   transaction_type:
 *                     type: string
 *                     enum: [IN, OUT]
 *                   remarks:
 *                     type: string
 *                   transaction_date:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid parameters
 */
router.get('/', getInventoryTransactions);

export default router;
