import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getSuppliers = async(req: Request, res: Response): Promise<void> =>{
    try {
        const suppliers = await prisma.suppliers.findMany({
            orderBy: {supplier_id: "asc"},
            select: {
                supplier_id: true,
                name: true,
                contact_email: true,
                contact_phone: true,
                address: true,
            },
        });
        res.json(suppliers);
    } catch (error) {
        console.error("Error retrieving suppliers: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
;}

export const addSupplier = async(req: Request, res: Response): Promise<void> => {
    const {name, contact_email, contact_phone, address}= req.body;
    try{
        const newSupplier = await prisma.suppliers.create({data: {name, contact_email, contact_phone, address}});
        res.status(201).json(newSupplier)
    }catch(error){
        console.error("Error adding supplier: ", error);
        res.status(500).json({error: "Internal server error"});
    }
    };

export const updateSupplier = async(req: Request, res: Response): Promise<void> => {
    const {id} = req.params;
    const {name, contact_email, contact_phone, address} = req.body;

    try{
        if(!id){
            res.status(400).json({error: "Supplier id is required"});
            return;
        }

        const updatedSupplier = await prisma.suppliers.update({ where:{
            supplier_id: Number(id)}, data: {name, contact_email, contact_phone, address}});
            res.status(200).json(updatedSupplier);
        }catch(error){
            console.error("Error updating supplier: ", error);
            res.status(500).json({error: "Internal server error"});
    }
};

export const deleteSupplier = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const supplierId = Number(id);
        if (isNaN(supplierId)) {
            res.status(400).json({ error: "Invalid product ID" });
            return;
        }

        const supplier = await prisma.suppliers.findUnique({
            where: { supplier_id: supplierId },
        });

        if (!supplier) {
            res.status(404).json({ error: "Product not found" });
            return;
        }

        await prisma.suppliers.delete({ where: { supplier_id: supplierId } });
        res.status(200).json({message: "Successfully deleted supplier"}); 
    } catch (error) {
        console.error("Error deleting supplier: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


