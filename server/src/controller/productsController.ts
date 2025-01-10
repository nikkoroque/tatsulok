import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.products.findMany({
            orderBy: { product_id: "asc"},
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
    } catch (error) {
        console.error("Error retrieving products: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const addProduct = async(req: Request, res: Response): Promise<void> => {
    const {name, description, category_id, quantity, price, created_at, updated_at}= req.body;
    try{
        const newProduct = await prisma.products.create({data: {name, description, category_id, quantity, price, created_at, updated_at}});
        res.status(201).json(newProduct)
    }catch(error){
        console.error("Error adding products: ", error);
        res.status(500).json({error: "Internal server error"});
    }
    };

export const updateProduct = async(req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const {name, description, category_id, quantity, price, created_at, updated_at} = req.body;

    try{
        if(!id){
            res.status(400).json({error: "Product id is required"});
            return;
        }

        const updatedProduct = await prisma.products.update({ where:{
            product_id: Number(id)}, data: {name, description, category_id, quantity, price, created_at, updated_at}});
            res.status(200).json(updatedProduct);
        }catch(error){
            console.error("Error updating product: ", error);
            res.status(500).json({error: "Internal server error"});

    }
};

export const deleteProduct = async(req: Request, res: Response): Promise<void> =>{
    const {id} = req.params;
    try {
        if(!id){
            res.status(400).json({error: "Product id is required"});
            return;
        }

        await prisma.products.delete({where: {product_id: Number(id)}});
        res.status(204).json("Successfully deleted product").send();
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({error: "Internal server error"});
        
    }

};

