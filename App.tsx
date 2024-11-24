import { KeyboardReturn } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { DashboardLayout, PageContainer } from "@toolpad/core";
import type { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MinimalLayout from "./src/MinimalLayout";
import RootView from "./src/RootView";

const HeaderWithBackButton = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "100%" }}
    >
      {/* Back Button */}
      <IconButton
        onClick={() => navigate(-1)} // Navigate back
        color="primary"
        sx={{ marginRight: 2 }}
        aria-label="go back"
      >
        <KeyboardReturn />
      </IconButton>

      {/* Logo */}
      <Typography
        variant="h6"
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          whiteSpace: "nowrap",
        }}
      >
        <img
          src="https://toolpad.dev/static/branding/logo.svg"
          alt="Toolpad Logo"
          style={{ width: 24, height: 24, marginRight: 8 }}
        />
        Toolpad
      </Typography>
    </Box>
  );
};

export default function App(): JSX.Element {
  const location = useLocation();

  // Define pages where header and sidebar should be hidden
  const minimalLayoutPaths = ["/signin", "/signup"];

  // Check if current route matches minimal layout paths
  const useMinimalLayout = minimalLayoutPaths.includes(location.pathname);

  // Check if the current route matches "/create" or "/property/:id/edit"
  const isCreateRoutePath =
    location.pathname === "/create" ||
    /^\/property\/[^/]+\/edit$/.test(location.pathname); // Regex to match "/property/${id}/edit"

  return useMinimalLayout ? (
    <MinimalLayout>
      <RootView />
    </MinimalLayout>
  ) : (
    <DashboardLayout
      hideNavigation={isCreateRoutePath} // Hide navigation for "/create" or "/property/:id/edit"
      slotProps={{
        toolbarActions: HeaderWithBackButton,
      }}
      // slots={{ headerContent: BrandingWithBackButton }}
    >
      <PageContainer breadcrumbs={[]} title="">
        <RootView />
      </PageContainer>
    </DashboardLayout>
  );
}
