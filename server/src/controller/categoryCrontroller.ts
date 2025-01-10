import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: { category_id: "asc"},
            select: {
                category_id: true,
                name: true,
                description: true,
            },
        });
        res.json(categories);
    } catch (error) {
        console.error("Error retrieving categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addCategory = async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body;
    try {
        const newCategory = await prisma.categories.create({ data: { name, description } });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        if (!id) {
            res.status(400).json({ error: "Category ID is required" });
            return;
        }

        const updatedCategory = await prisma.categories.update({ where: { category_id: Number(id) }, data: { name, description } });
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        if (!id) {
            res.status(400).json({ error: "Category ID is required" });
            return;
        }

        await prisma.categories.delete({ where: { category_id: Number(id) } });
        res.status(204).json("Successfully deleted category").send();
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};