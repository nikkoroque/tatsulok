"use client"

import React from 'react'
import { useGetTransactionsQuery } from '@/api/api'
import { GridColDef } from '@mui/x-data-grid';
import AppHeader from '../../components/Header/app-header';
import AppTitle from '../../components/Title/app-title';
import DataGridTable from "../../components/Datagrid/app-datagrid";

const Transactions = () => {
  const { data: transactionData = [] } = useGetTransactionsQuery()

  const transformedData = transactionData?.map((transaction) => ({
    ...transaction,
    id: transaction.transaction_id,
  }));

  const columns: GridColDef[] = [
    { field: "transaction_id", headerName: "ID", minWidth: 100 },
    { field: "product_id", headerName: "Product ID", minWidth: 150 },
    { field: "quantity", headerName: "Quantity", minWidth: 80 },
    { field: "transaction_type", headerName: "Transaction Type", minWidth: 150 },
    { 
      field: "transaction_date", 
      headerName: "Transaction Date",   
      minWidth: 200,
      valueGetter: (value) => value && new Date(value).toLocaleString(),
    },
    { field: "remarks", headerName: "Remarks", flex: 1, width: 350 },
  ];

  return (
    <>
      <AppHeader
        breadcrumbLink="/dashboard"
        breadcrumbLinkText="Dashboard"
        breadcrumbPage="Transaction"
      />
        <div className="flex justify-between items-center">
            <AppTitle title="Transactions" />
        </div>
        <DataGridTable
            rows={transformedData}
            columns={columns}
            onRowSelectionModelChange={() => {}}
        />
    </>
  )
}

export default Transactions