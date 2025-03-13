"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productsController_1 = require("../controller/productsController");
const router = (0, express_1.Router)();
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
router.get("/", productsController_1.getProducts);
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
router.post("/", productsController_1.addProduct);
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
router.put("/:id", productsController_1.updateProduct);
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
router.delete("/:id", productsController_1.deleteProduct);
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
router.get("/validate/:name", productsController_1.validateProduct);
exports.default = router;
