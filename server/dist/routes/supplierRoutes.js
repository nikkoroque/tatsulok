"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supplierController_1 = require("../controller/supplierController");
const router = (0, express_1.Router)();
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
router.get("/", supplierController_1.getSuppliers);
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
router.post("/", supplierController_1.addSupplier);
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
router.put("/:id", supplierController_1.updateSupplier);
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
router.delete("/:id", supplierController_1.deleteSupplier);
exports.default = router;
