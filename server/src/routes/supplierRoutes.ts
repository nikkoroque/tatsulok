import { Router } from "express";
import { addSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../controller/supplierController";

const router = Router();

/**
 * @swagger
 * /api/supplier:
 *   get:
 *     summary: Get all suppliers
 *     tags: [Supplier]
 *     responses:
 *       200:
 *         description: List of Suppliers
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
 *                   contact_email:
 *                     type: string
 *                   contact_phone:
 *                     type: string
 *                   address:
 *                     type: string
 */
router.get("/", getSuppliers);

/**
 * @swagger
 * /api/supplier:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Supplier]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   name:
 *                     type: string
 *                   contact_email:
 *                     type: string
 *                   contact_phone:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       201:
 *         description: Supplier created successfully
 */
router.post("/", addSupplier);

/**
 * @swagger
 * /api/supplier/{id}:
 *   put:
 *     summary: Update a supplier
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Supplier Id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                   name:
 *                     type: string
 *                   contact_email:
 *                     type: string
 *                   contact_phone:
 *                     type: string
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 */
router.put("/:id", updateSupplier);

/**
 * @swagger
 * /api/supplier/{id}:
 *   delete:
 *     summary: Delete a supplier
 *     tags: [Supplier]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Supplier ID
 *     responses:
 *       204:
 *         description: Supplier deleted successfully
 */
router.delete("/:id", deleteSupplier);

export default router;
