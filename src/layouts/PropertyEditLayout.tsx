import { Box } from "@mui/material";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Outlet } from "react-router-dom";

export default function PropertyEditLayout() {
  return (
    <DashboardLayout
      hideNavigation={true}
      //   slots={{ : HeaderWithBackButton }} // Add the header with a back button
    >
      <Box sx={{ padding: 2 }}>
        <Outlet /> {/* Renders the nested content for /property/:id/edit */}
      </Box>
    </DashboardLayout>
  );
}
