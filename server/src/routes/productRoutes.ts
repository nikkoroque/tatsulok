import { Router } from "express";
import { addProduct, deleteProduct, getProducts, updateProduct, validateProduct } from "../controller/productsController";

const router = Router();

/**
 * @swagger
 * /api/products:
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
 *                   product_id:
 *                     type: integer
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
 *                   img:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                   updated_at:
 *                     type: string
 */
router.get("/", getProducts);


/**
 * @swagger
 * /api/products:
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
 *                   img:
 *                     type: string
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
 * /api/products/{id}:
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
 *                   img:
 *                     type: string
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
 * /api/products/{id}:
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

/**
 * @swagger
 * /api/products/validate/{name}:
 *   get:
 *     summary: Validate a product name
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Product name
 *     responses:
 *       200:
 *         description: Product name is available
 *       400:
 *         description: Product name is required
 *       409:
 *         description: Product name already exists
 *       500:
 *         description: Internal server error
 */
router.get("/validate/:name", validateProduct);



export default router;
