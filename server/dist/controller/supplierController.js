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
exports.validateSupplier = exports.deleteSupplier = exports.updateSupplier = exports.addSupplier = exports.getSuppliers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getSuppliers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const suppliers = yield prisma.suppliers.findMany({
            orderBy: { supplier_id: "asc" },
            select: {
                supplier_id: true,
                name: true,
                contact_email: true,
                contact_phone: true,
                address: true,
            },
        });
        res.json(suppliers);
    }
    catch (error) {
        console.error("Error retrieving suppliers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    ;
});
exports.getSuppliers = getSuppliers;
const addSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, contact_email, contact_phone, address } = req.body;
    try {
        const newSupplier = yield prisma.suppliers.create({ data: { name, contact_email, contact_phone, address } });
        res.status(201).json(newSupplier);
    }
    catch (error) {
        console.error("Error adding supplier: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addSupplier = addSupplier;
const updateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, contact_email, contact_phone, address } = req.body;
    try {
        if (!id) {
            res.status(400).json({ error: "Supplier id is required" });
            return;
        }
        const updatedSupplier = yield prisma.suppliers.update({ where: {
                supplier_id: Number(id)
            }, data: { name, contact_email, contact_phone, address } });
        res.status(200).json(updatedSupplier);
    }
    catch (error) {
        console.error("Error updating supplier: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateSupplier = updateSupplier;
const deleteSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const supplierId = Number(id);
        if (isNaN(supplierId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        const supplier = yield prisma.suppliers.findUnique({
            where: { supplier_id: supplierId },
        });
        if (!supplier) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield prisma.suppliers.delete({ where: { supplier_id: supplierId } });
        res.status(200).json({ message: "Successfully deleted supplier" });
    }
    catch (error) {
        console.error("Error deleting supplier: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteSupplier = deleteSupplier;
const validateSupplier = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const existingSupplier = yield prisma.suppliers.findFirst({ where: { name: { equals: name, mode: "insensitive" } } });
        if (existingSupplier) {
            res.status(409).json({ error: "Supplier already exists." });
            return;
        }
        res.status(200).json({ message: "Supplier is available." });
    }
    catch (error) {
        console.error("Error validating supplier:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.validateSupplier = validateSupplier;
