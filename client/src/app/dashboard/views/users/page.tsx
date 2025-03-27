"use client"
import React, { useState } from 'react'
import AppHeader from '../../components/Header/app-header'
import AppTitle from '../../components/Title/app-title'
import DataGridTable from '../../components/Datagrid/app-datagrid'
import { useCreateUserMutation, useDeleteUserMutation, useUpdateUserMutation, useGetUsersQuery } from '@/api/api'
import { User } from '@/models/User'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { formattedTimestamp } from '@/utils/formatted-time'
import { ToastAction } from '@/components/ui/toast'
import { GridColDef } from '@mui/x-data-grid'
import ActionMenu from '../../components/ActionMenu/app-action-menu'
import { Button } from '@/components/ui/button'
import { DeleteButton } from '../../components/DeleteButton/app-delete-button'
import ConfirmationDialog from '../../components/AlertDialog/app-confirmation-dialog'
import AddEditUserModal from './components/AddEditUserModal'

const UsersPage = () => {
    const {toast} = useToast()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedRow, setSelectedRow] = useState<User | null>(null)
    const {data: userData = []} = useGetUsersQuery()
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [deleteAction, setDeleteAction] = useState<"single" | "mass" | null>(null)
    const [currentIdToDelete, setCurrentIdToDelete] = useState<number | null>(null)
    const {hasPermission} = useAuth()

    const [createUser] = useCreateUserMutation()
    const [updateUser] = useUpdateUserMutation()
    const [deleteUser] = useDeleteUserMutation()

    const handleCreateUser = async (userData: User) => {
        try {
            await createUser(userData)
            toast({
                title: "User created successfully",
                description: formattedTimestamp(),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error creating user",
                description: `An error occurred while creating the user. ${formattedTimestamp()} : ${error}`,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    };

    const handleUpdateUser = async (id: number, userData: Partial<User>) => {
        try {
            await updateUser({id, data: userData}).unwrap()
            toast({
                title: "User updated successfully",
                description: formattedTimestamp(),
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error updating user",
                description: `An error occurred while updating the user. ${formattedTimestamp()} : ${error}`,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    };
    
    const handleDeleteClick = (id: number) => {
        setCurrentIdToDelete(id)
        setDeleteAction("single")
        setIsDialogOpen(true)
    };
    
    const handleMassDeleteClick = () => {
        if (selectedIds.length === 0) {
            toast({
                title: "No users selected",
                description: `Please select at least one user to delete. ${formattedTimestamp()}`,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
            return;
        }
        setDeleteAction("mass")
        setIsDialogOpen(true)
    };

    const handleConfirmDelete = async () => {
        try {
            if (deleteAction === "single" && currentIdToDelete !== null) {
                await deleteUser(currentIdToDelete).unwrap()
                toast({
                    title: "User deleted successfully",
                    description: formattedTimestamp(),
                })
            } else if (deleteAction === "mass" && selectedIds.length > 0) {
                for (const id of selectedIds) {
                    await deleteUser(id).unwrap()
                }
                setSelectedIds([])
                toast({
                    title: "Users deleted successfully",
                    description: formattedTimestamp(),
                })
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error deleting users",
                description: `An error occurred while deleting the users. ${formattedTimestamp()} : ${error}`,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        } finally {
            setIsDialogOpen(false)
            setDeleteAction(null)
            setCurrentIdToDelete(null)
        }
    };

    const handleCancelDelete = () => {
        setIsDialogOpen(false)
        setDeleteAction(null)
        setCurrentIdToDelete(null)
    };

    const handleSelectionChange = (ids: number[]) => {
        setSelectedIds(ids)
    };

    const handleAddNew = () => {
        setSelectedRow(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedRow(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const transformedData = userData.map((user) => ({
        ...user,
        id: user.user_id,
    }));
    
    const columns: GridColDef[] = [
        { field: "user_id", headerName: "User ID", flex: 0, minWidth: 100 },
        { field: "username", headerName: "Username", flex: 0, minWidth: 150 },
        { field: "email", headerName: "Email", flex: 0, minWidth: 200 },
        { field: "role", headerName: "Role", flex: 0, minWidth: 150 },
        { field: "created_at", headerName: "Created At", flex: 0, minWidth: 200 },
        { field: "actions", headerName: "Actions", width: 70, headerAlign: "center", align: "center", renderCell: (params) => (
            <ActionMenu
                row={params.row}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                idKey="user_id"
                resource="users"
            />
        )},
    ]
    
    
    
  return (
    <>
        <AppHeader breadcrumbLink="/dashboard" breadcrumbLinkText="Dashboard" breadcrumbPage="Users" />
        <div className="flex justify-between items-center">
            <AppTitle title="Users" />
            <div className="flex justify-between items-center space-x-2">
                <DeleteButton
                    variant="outline"
                className={`flex py-2 px-4 ${
                    selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onDelete={handleMassDeleteClick}
                resource="users"
            />
            {hasPermission('create', 'users') && (
                <Button
                    onClick={handleAddNew}
                    className="hover:bg-primary dark:hover:bg-primary"
                    >
                        Add New
                    </Button>
                )}
            </div>
        </div>

        <DataGridTable
            rows={transformedData}
            columns={columns}
            onRowSelectionModelChange={handleSelectionChange}
        />
        <AddEditUserModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onCreate={handleCreateUser}
            onUpdate={handleUpdateUser}
            row={selectedRow}
        />
        <ConfirmationDialog
            isOpen={isDialogOpen}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            title={
                deleteAction === "single" ? "Delete User" : "Delete Users"
            }
            message={
                deleteAction === "single" ? "Are you sure you want to delete this user?" : "Are you sure you want to delete the selected users?"
            }
        />
    </>
  );
};

export default UsersPage;