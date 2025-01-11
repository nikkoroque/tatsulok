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
exports.deleteCategory = exports.updateCategory = exports.addCategory = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.categories.findMany({
            orderBy: { category_id: "asc" },
            select: {
                category_id: true,
                name: true,
                description: true,
            },
        });
        res.json(categories);
    }
    catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getCategories = getCategories;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    try {
        const newCategory = yield prisma.categories.create({ data: { name, description } });
        res.status(201).json(newCategory);
    }
    catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.addCategory = addCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        if (!id) {
            res.status(400).json({ error: "Category ID is required" });
            return;
        }
        const updatedCategory = yield prisma.categories.update({
            where: { category_id: Number(id) },
            data: { name, description }
        });
        res.status(200).json(updatedCategory);
    }
    catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            res.status(400).json({ error: "Category ID is required" });
            return;
        }
        yield prisma.categories.delete({ where: { category_id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCategory = deleteCategory;
