import { Box } from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";

const TatsulokToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton
        slotProps={{
          tooltip: { title: "Manage Columns" },
          button: { color: "inherit" },
        }}
      />
      <GridToolbarFilterButton
        slotProps={{
          button: { color: "inherit" },
        }}
      />
      <GridToolbarDensitySelector
        slotProps={{
          tooltip: { title: "Change density" },
          button: { color: "inherit" },
        }}
      />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarExport
        slotProps={{
          tooltip: { title: "Export data" },
          button: { variant: "outlined", color: "inherit" },
        }}
      />
    </GridToolbarContainer>
  );
};

export default TatsulokToolbar;