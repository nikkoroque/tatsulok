import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { category_id: "asc" },
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

export const addCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, description } = req.body;
  try {
    const newCategory = await prisma.categories.create({
      data: { name, description },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    const updatedCategory = await prisma.categories.update({
      where: { category_id: Number(id) },
      data: { name, description },
    });
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    await prisma.categories.delete({ where: { category_id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    if (!id) {
      res.status(400).json({ error: "Category ID is required" });
      return;
    }

    const category = await prisma.categories.findUnique({ where: { category_id: Number(id) } });
    
    if (!category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(category);
  } catch (error) {
    console.error("Error retrieving category details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const validateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name } = req.params;

  if (!name) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  try {
    const existingCategory = await prisma.categories.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existingCategory) {
      res.status(409).json({ error: "Category already exists." });
      return;
    }
    res.status(200).json({ message: "Category is available." });
  } catch (error) {
    console.error("Error validating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
