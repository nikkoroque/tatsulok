import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.products.findMany();
        res.json(products);
    } catch (error) {
        console.error("Error retrieving products: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const addProduct = async(req: Request, res: Response): Promise<void> => {
    const {name, description, category_id, quantity, price, img, created_at, updated_at}= req.body;
    try{
        const newProduct = await prisma.products.create({data: {name, description, category_id, quantity, price, img, created_at, updated_at}});
        res.status(201).json(newProduct)
    }catch(error){
        console.error("Error adding products: ", error);
        res.status(500).json({error: "Internal server error"});
    }
    };

export const updateProduct = async(req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const {name, description, category_id, quantity, price, img, created_at, updated_at} = req.body;

    try{
        if(!id){
            res.status(400).json({error: "Product id is required"});
            return;
        }

        const updatedProduct = await prisma.products.update({ where:{
            product_id: Number(id)}, data: {name, description, category_id, quantity, price, img, created_at, updated_at}});
            res.status(200).json(updatedProduct);
        }catch(error){
            console.error("Error updating product: ", error);
            res.status(500).json({error: "Internal server error"});

    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const productId = Number(id);
        if (isNaN(productId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }

        const product = await prisma.products.findUnique({
            where: { product_id: productId },
        });

        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        await prisma.products.delete({ where: { product_id: productId } });
        res.status(200).json({message: "Successfully deleted product"}); 
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
    
};

export const validateProduct = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.params;

    if (!name) {
        res.status(400).json({ error: "Product name is required" });
        return;
    }

    try {
        const existingProduct = await prisma.products.findFirst({
            where: { name: { equals: name, mode: "insensitive" } },
        });

        if (existingProduct) {
            res.status(409).json({ error: "Product name already exists." });
            return;
        }

        res.status(200).json({ message: "Product name is available." });
    } catch (error) {
        console.error("Error validating product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

