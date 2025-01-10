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
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// export const getProducts = async(req: Request, res: Response): Promise<void> => {
//     try {
//         const products = await prisma.products.findMany({
//             orderBy: { product_id: "asc"},
//             select: {
//                 product_id: true,
//                 name: true,
//                 description: true,
//                 category_id: true,
//                 quantity: true,
//                 price: true,
//                 created_at: true,
//                 updated_at: true,
//             },
//         });
//         res.json(products)
//     } catch (error) {
//         console.error("Error retrieving products: ", error);
//         res.status(500).json({error: "Internal server error"});
//     }
// };
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany({
            orderBy: { product_id: "asc" },
            select: {
                product_id: true,
                name: true,
                description: true,
                category_id: true,
                quantity: true,
                price: true,
                created_at: true,
                updated_at: true,
            },
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error retrieving products: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getProducts = getProducts;
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, category_id, quantity, price, created_at, updated_at } = req.body;
    try {
        const newProduct = yield prisma.products.create({ data: { name, description, category_id, quantity, price, created_at, updated_at } });
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
    const { name, description, category_id, quantity, price, created_at, updated_at } = req.body;
    try {
        if (!id) {
            res.status(400).json({ error: "Product id is required" });
            return;
        }
        const updatedProduct = yield prisma.products.update({ where: {
                product_id: Number(id)
            }, data: { name, description, category_id, quantity, price, created_at, updated_at } });
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
        if (!id) {
            res.status(400).json({ error: "Product id is required" });
            return;
        }
        yield prisma.products.delete({ where: { product_id: Number(id) } });
        res.status(204).json("Successfully deleted product").send();
    }
    catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteProduct = deleteProduct;
