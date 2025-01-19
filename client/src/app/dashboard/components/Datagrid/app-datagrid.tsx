import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TatsulokToolbar from "./Toolbar/tat-toolbar";


type MuiDataGridProps<T> = {
  rows: T[]; // Generic type for row data
  columns: GridColDef[];
  onRowSelectionModelChange: (ids: number[]) => void;
};

const NoRowsOverlay = () => (
  <div className="min-h-[100vh] flex-1 rounded-xl bg-zinc-100/50 md:min-h-min dark:bg-zinc-800/50">
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <p>No records available</p>
    </div>
  </div>
);

const MuiDataGrid = <T extends { id: number }>({
  rows,
  columns,
  onRowSelectionModelChange,
}: MuiDataGridProps<T>) => {
  return (
    <div className="grid auto-rows-min py-4">
      <DataGrid
        sx={{ fontFamily: "inherit" }}
        slots={{
          toolbar: TatsulokToolbar,
          noResultsOverlay: NoRowsOverlay,
        }}
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        checkboxSelection
        onRowSelectionModelChange={(ids) =>
          onRowSelectionModelChange(ids as number[])
        }
        className="bg-white shadow rounded-lg border border-gray-200 !text-gray-700 text-sm antialiased"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 25,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        disableRowSelectionOnClick
      />
    </div>
  );
};

export default MuiDataGrid;