import express from 'express';
import { 
  createTransaction, 
  getTransaction, 
  updateTransaction, 
  voidTransaction, 
  getInventoryTransactions 
} from '../controller/transactionController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - transactionType
 *         - amount
 *       properties:
 *         productId:
 *           type: integer
 *           description: The ID of the product
 *         quantity:
 *           type: integer
 *           description: The quantity of the transaction
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount/price for the transaction
 *         transactionType:
 *           type: string
 *           enum: [IN, OUT, SALE, RETURN]
 *           description: The type of transaction
 *         remarks:
 *           type: string
 *           description: Additional notes about the transaction
 *     
 *     VoidTransactionRequest:
 *       type: object
 *       required:
 *         - voidReason
 *       properties:
 *         voidReason:
 *           type: string
 *           description: Reason for voiding the transaction
 *     
 *     TransactionDetail:
 *       type: object
 *       properties:
 *         transaction_id:
 *           type: integer
 *           description: The ID of the transaction
 *         product_id:
 *           type: integer
 *           description: The ID of the product
 *         transaction_type:
 *           type: string
 *           enum: [IN, OUT, SALE, RETURN]
 *           description: The type of transaction
 *         quantity:
 *           type: integer
 *           description: Transaction quantity
 *         amount:
 *           type: number
 *           format: float
 *           description: Transaction amount/price
 *         transaction_date:
 *           type: string
 *           format: date-time
 *           description: Date of the transaction
 *         remarks:
 *           type: string
 *           description: Transaction remarks
 *         products:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Product name
 *             price:
 *               type: string
 *               description: Product price
 *             quantity:
 *               type: integer
 *               description: Current product quantity
 *     
 *     VoidTransactionResponse:
 *       type: object
 *       properties:
 *         originalTransaction:
 *           $ref: '#/components/schemas/TransactionDetail'
 *           description: The original transaction that was voided
 *         reversalTransaction:
 *           $ref: '#/components/schemas/TransactionDetail'
 *           description: The new transaction created to reverse the original
 *         adjustedQuantity:
 *           type: integer
 *           description: Final product quantity after voiding the transaction
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transaction'
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/', createTransaction);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: List of all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 */
router.get('/', getInventoryTransactions);

/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction details
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', getTransaction);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Transaction ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: New transaction amount
 *               remarks:
 *                 type: string
 *                 description: Updated remarks
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       404:
 *         description: Transaction not found
 */
router.put('/:id', updateTransaction);

/**
 * @swagger
 * /api/transactions/{id}/void:
 *   post:
 *     summary: Void a transaction and create a reversal entry
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction to void
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoidTransactionRequest'
 *           example:
 *             voidReason: "Customer return"
 *     responses:
 *       200:
 *         description: Transaction voided successfully with reversal transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoidTransactionResponse'
 *             example:
 *               originalTransaction:
 *                 transaction_id: 1
 *                 product_id: 1
 *                 transaction_type: "SALE"
 *                 quantity: 2
 *                 transaction_date: "2024-01-26T15:00:00Z"
 *                 remarks: "Original sale [VOIDED: Customer return, Reversal: #2]"
 *                 products:
 *                   name: "Product A"
 *                   price: "100.00"
 *                   quantity: 10
 *               reversalTransaction:
 *                 transaction_id: 2
 *                 product_id: 1
 *                 transaction_type: "RETURN"
 *                 quantity: 2
 *                 transaction_date: "2024-01-26T15:05:00Z"
 *                 remarks: "Reversal of Transaction #1 - Customer return"
 *                 products:
 *                   name: "Product A"
 *                   price: "100.00"
 *                   quantity: 10
 *               adjustedQuantity: 12
 *       400:
 *         description: Invalid request or operation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Transaction not found"
 *       404:
 *         description: Transaction not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Transaction not found"
 */
router.post('/:id/void', voidTransaction);

export default router;