"use client";

import {
  useDeleteSupplierMutation,
  useCreateSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import AppHeader from "../../components/Header/app-header";
import DataGridTable from "../../components/Datagrid/app-datagrid";
import AppTitle from "../../components/Title/app-title";
import { Supplier } from "@/models/Supplier";
import { ToastAction } from "@/components/ui/toast";
import { formattedTimestamp } from "@/utils/formatted-time";
import ActionMenu from "../../components/ActionMenu/app-action-menu";
import ConfirmationDialog from "../../components/AlertDialog/app-confirmation-dialog";
import AddEditSupplierModal from "./components/AddEditSupplierModal";
import { Button } from "@/components/ui/button";

const Suppliers = () => {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Supplier | null>(null);
  const { data: supplierData = [], isLoading } = useGetSuppliersQuery();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteAction, setDeleteAction] = useState<"single" | "mass" | null>(
    null
  );

  const [currentIdToDelete, setCurrentIdToDelete] = useState<number | null>(
    null
  );

  const [createSupplier, { isLoading: isCreatingSupplier }] =
    useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdatingSupplier }] =
    useUpdateSupplierMutation();
  const [deleteSupplier, { isLoading: isDeletingSupplier }] =
    useDeleteSupplierMutation();

  const handleCreateSupplier = async (supplierData: Supplier) => {
    try {
      await createSupplier(supplierData);
      toast({
        title: "Supplier created successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while creating the supplier. ${formattedTimestamp()}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  const handleUpdateSupplier = async (
    id: number,
    supplierData: Partial<Supplier>
  ) => {
    try {
      await updateSupplier({ id, data: supplierData }).unwrap();
      toast({
        title: "Supplier updated successfully",
        description: formattedTimestamp(),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while updating the supplier. ${formattedTimestamp()}`,
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
        title: "No suppliers selected",
        description: `Please select at least one supplier to delete. ${formattedTimestamp()}`,
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
        await deleteSupplier(currentIdToDelete).unwrap();
        toast({
          title: "Supplier deleted successfully",
          description: formattedTimestamp(),
        });
      } else if (deleteAction === "mass" && selectedIds.length > 0) {
        // Mass delete
        for (const id of selectedIds) {
          await deleteSupplier(id).unwrap();
        }
        setSelectedIds([]);
        toast({
          title: "Suppliers deleted successfully",
          description: formattedTimestamp(),
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `An error occurred while deleting the suppliers. ${formattedTimestamp()}`,
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

  const handleEditSupplierRow = (row: Supplier) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  // Transform the data to use supplier_id as id
  const transformedData = supplierData.map((supplier) => ({
    ...supplier,
    id: supplier.supplier_id,
  }));

  const columns: GridColDef[] = [
    { field: "supplier_id", headerName: "ID", width: 60 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "contact_email", headerName: "E-mail", width: 200 },
    { field: "contact_phone", headerName: "Contact", width: 150 },
    { field: "address", headerName: "Address", width: 350 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <ActionMenu
          row={params.row}
          onEdit={handleEditSupplierRow}
          onDelete={handleDeleteClick}
          idKey="supplier_id"
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
        breadcrumbPage="Supplier"
      />
      <div className="flex justify-between items-center">
        <AppTitle title="Suppliers" />
        <div className="flex justify-between items-center space-x-2">
          <Button
            variant="outline"
            className={`flex py-2 px-4 ${
              selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
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
      {/* CREATE SUPPLIER MODAL */}
      <AddEditSupplierModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRow(null);
        }}
        onCreate={handleCreateSupplier}
        onUpdate={handleUpdateSupplier}
        row={selectedRow}
      />
      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title={
          deleteAction === "single" ? "Delete Supplier" : "Delete Suppliers"
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message={
          deleteAction === "single"
            ? "Are you sure you want to delete this supplier?"
            : "Are you sure you want to delete the selected suppliers?"
        }
      />
    </>
  );
};

export default Suppliers;
