"use client";

import React, { useState } from 'react'
import AppHeader from '../../components/Header/app-header';
import AppTitle from '../../components/Title/app-title';
import { Button } from '@/components/ui/button';
import DataGridTable from "../../components/Datagrid/app-datagrid";
import { Product } from "@/models/Products";
import { useToast } from '@/hooks/use-toast';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery, useUpdateProductMutation } from '@/api/api';
import { GridColDef } from '@mui/x-data-grid';
import ActionMenu from '../../components/ActionMenu/app-action-menu';
import { formattedTimestamp } from '@/utils/formatted-time';
import { ToastAction } from '@/components/ui/toast';
import AddEditProductModal from './components/AddEditProductModal';
import ConfirmationDialog from '../../components/AlertDialog/app-confirmation-dialog';



const ProductsPage = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Product | null>(null);
  const { data: productData = [] } = useGetProductsQuery();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteAction, setDeleteAction] = useState<"single" | "mass" | null>(
    null
  );

  const [currentIdToDelete, setCurrentIdToDelete] = useState<number | null>(
    null
  );

  const [createProduct] =
    useCreateProductMutation();
  const [updateProduct] =
    useUpdateProductMutation();
  const [deleteProduct] =
    useDeleteProductMutation();


  const handleCreateProduct = async (productData: Product) => {
    try {
      await createProduct(productData);
      toast({
        title: "Product created successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while creating the product. ${formattedTimestamp()} : ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleUpdateProduct = async (
    id: number,
    productData: Partial<Product>
  ) => {
    try {
      await updateProduct({ id, data: productData }).unwrap();
      toast({
        title: "Product updated successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while updating the product. ${formattedTimestamp()} : ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };


  const handleDeleteClick = (id: number) => {
    setCurrentIdToDelete(id);
    setDeleteAction("single");
    setIsDialogOpen(true);
  };

  const handleMassDeleteClick = () => {
    if (selectedIds.length === 0) {
      toast({
        title: "No products selected",
        description: `Please select at least one product to delete. ${formattedTimestamp()}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    setDeleteAction("mass");
    setIsDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    try {
      if (deleteAction === "single" && currentIdToDelete !== null) {
        // Single delete
        await deleteProduct(currentIdToDelete).unwrap();
        toast({
          title: "Product deleted successfully",
          description: formattedTimestamp(),
        });
      } else if (deleteAction === "mass" && selectedIds.length > 0) {
        // Mass delete
        for (const id of selectedIds) {
          await deleteProduct(id).unwrap();
        }
        setSelectedIds([]);
        toast({
          title: "Products deleted successfully",
          description: formattedTimestamp(),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while deleting the products. ${formattedTimestamp()} : ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsDialogOpen(false);
      setDeleteAction(null);
      setCurrentIdToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setDeleteAction(null);
    setCurrentIdToDelete(null);
  };

  const handleSelectionChange = (ids: number[]) => {
    setSelectedIds(ids);
  };

  const handleEditProductRow = (row: Product) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };



  // Transform the data to use product_id as id
  const transformedData = productData.map((product) => ({
    ...product,
    id: product.product_id,
  }));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 0, minWidth: 150 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 100 },
    { field: "quantity", headerName: "Quantity", flex: 1, minWidth: 200 },
    { field: "price", headerName: "Price", flex: 1, minWidth: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      headerAlign: "center",
      align: "center",
      sortable: false,
      renderCell: (params) => (
        <ActionMenu
          row={params.row}
          onEdit={handleEditProductRow}
          onDelete={handleDeleteClick}
          idKey="product_id"
        />
      ),
    },
  ]






  return (
    <>
      <AppHeader breadcrumbLink='/dashboard' breadcrumbLinkText='Dashboard' breadcrumbPage='Products'
      />
      <div className="flex justify-between items-center">
        <AppTitle title="Products" />
        <div className="flex justify-between items-center space-x-2">
          <Button
            variant="outline"
            className={`flex py-2 px-4 ${selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onClick={handleMassDeleteClick}
            disabled={selectedIds.length === 0}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              setIsModalOpen(true);
            }}
            className="hover:bg-primary dark:hover:bg-primary"
          >
            Add New
          </Button>
        </div>
      </div>


      {/* DATA GRID TABLE */}
      <DataGridTable
        rows={transformedData}
        columns={columns}
        onRowSelectionModelChange={handleSelectionChange}
      />

      {/* CREATE PRODUCT MODAL */}
      <AddEditProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
        onCreate={handleCreateProduct}
        onUpdate={handleUpdateProduct}
        row={selectedRow}
      />

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={
          deleteAction === "single" ? "Delete Product" : "Delete Products"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={
          deleteAction === "single"
            ? "Are you sure you want to delete this product?"
            : "Are you sure you want to delete the selected products?"
        }
      />

    </>







  );
}

export default ProductsPage;