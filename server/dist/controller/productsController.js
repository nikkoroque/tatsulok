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
exports.validateProduct = exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany();
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getProducts = getProducts;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category_id, quantity, price, img, created_at, updated_at } = req.body;
    try {
        const newProduct = yield prisma.products.create({ data: { name, description, category_id, quantity, price, img, created_at, updated_at } });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.error("Error adding products: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addProduct = addProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description, category_id, quantity, price, img, created_at, updated_at } = req.body;
    try {
        if (!id) {
            res.status(400).json({ error: "Product id is required" });
            return;
        }
        const updatedProduct = yield prisma.products.update({ where: {
                product_id: Number(id)
            }, data: { name, description, category_id, quantity, price, img, created_at, updated_at } });
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        console.error("Error updating product: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productId = Number(id);
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }
        const product = yield prisma.products.findUnique({
            where: { product_id: productId },
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        yield prisma.products.delete({ where: { product_id: productId } });
        res.status(200).json({ message: "Successfully deleted product" });
    }
    catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
const validateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    if (!name) {
        res.status(400).json({ error: "Product name is required" });
        return;
    }
    try {
        const existingProduct = yield prisma.products.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
        });
        if (existingProduct) {
            res.status(409).json({ error: "Product name already exists." });
            return;
        }
        res.status(200).json({ message: "Product name is available." });
    }
    catch (error) {
        console.error("Error validating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.validateProduct = validateProduct;
