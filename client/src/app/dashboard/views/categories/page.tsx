"use client";

import { useToast } from "@/hooks/use-toast";
import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import AppHeader from "../../components/Header/app-header";
import DataGridTable from "../../components/Datagrid/app-datagrid";
import AppTitle from "../../components/Title/app-title";
import { ToastAction } from "@/components/ui/toast";
import { formattedTimestamp } from "@/utils/formatted-time";
import ActionMenu from "../../components/ActionMenu/app-action-menu";
import ConfirmationDialog from "../../components/AlertDialog/app-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/models/Category";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "@/api/api";
import AddEditCategoryModal from "./components/AddEditCategoryModal";
import { DeleteButton } from "../../components/DeleteButton/app-delete-button";

const Categories = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Category | null>(null);
  const { data: categoryData = [] } = useGetCategoriesQuery();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteAction, setDeleteAction] = useState<"single" | "mass" | null>(
    null
  );

  const [currentIdToDelete, setCurrentIdToDelete] = useState<number | null>(
    null
  );

  const [createCategory] =
    useCreateCategoryMutation();
  const [updateCategory] =
    useUpdateCategoryMutation();
  const [deleteCategory] =
    useDeleteCategoryMutation();

  const handleCreateCategory = async (categoryData: Category) => {
    try {
      await createCategory(categoryData);
      toast({
        title: "Category created successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while creating the category. ${formattedTimestamp()} : ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleUpdateCategory = async (
    id: number,
    categoryData: Partial<Category>
  ) => {
    try {
      await updateCategory({ id, data: categoryData }).unwrap();
      toast({
        title: "Category updated successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while updating the category. ${formattedTimestamp()} : ${error}`,
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
        title: "No categories selected",
        description: `Please select at least one category to delete. ${formattedTimestamp()}`,
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
        await deleteCategory(currentIdToDelete).unwrap();
        toast({
          title: "Category deleted successfully",
          description: formattedTimestamp(),
        });
      } else if (deleteAction === "mass" && selectedIds.length > 0) {
        // Mass delete
        for (const id of selectedIds) {
          await deleteCategory(id).unwrap();
        }
        setSelectedIds([]);
        toast({
          title: "Categories deleted successfully",
          description: formattedTimestamp(),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while deleting the categories. ${formattedTimestamp()} : ${error}`,
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

  const handleEditCategoryRow = (row: Category) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  // Transform the data to use category_id as id
  const transformedData = categoryData.map((category) => ({
    ...category,
    id: category.category_id,
  }));

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 0, minWidth: 150 },
    { field: "description", headerName: "Description", flex: 1, minWidth: 200 },
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
          onEdit={handleEditCategoryRow}
          onDelete={handleDeleteClick}
          idKey="category_id"
          resource="categories"
        />
      ),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <AppHeader
        breadcrumbLink="/dashboard"
        breadcrumbLinkText="Dashboard"
        breadcrumbPage="Category"
      />
      <div className="flex justify-between items-center">
        <AppTitle title="Categories" />
        <div className="flex justify-between items-center space-x-2">
          <DeleteButton
            variant="outline"
            className={`flex py-2 px-4 ${selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            onDelete={handleMassDeleteClick}
            resource="categories"
          />
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

      {/* CREATE CATEGORY MODAL */}
      <AddEditCategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
        onCreate={handleCreateCategory}
        onUpdate={handleUpdateCategory}
        row={selectedRow}
      />

      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={
          deleteAction === "single" ? "Delete Category" : "Delete Categories"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={
          deleteAction === "single"
            ? "Are you sure you want to delete this category?"
            : "Are you sure you want to delete the selected categories?"
        }
      />
    </>
  );
};

export default Categories;
