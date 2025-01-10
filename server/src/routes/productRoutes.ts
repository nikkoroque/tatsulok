import { Router } from "express";
import { addProduct, deleteProduct, getProducts, updateProduct } from "../controller/productsController";

const router = Router();

/**
 * @swagger
 * /api/product:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category_id:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 */
router.get("/", getProducts);


/**
 * @swagger
 * /api/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category_id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", addProduct);


/**
 * @swagger
 * /api/product/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category_id:
 *                     type: integer
 *                   quantity:
 *                     type: integer
 *                   price:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", updateProduct);


/**
 * @swagger
 * /api/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */
router.delete("/:id", deleteProduct);
export default router;
