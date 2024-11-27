import {
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  KeyboardReturn,
  Lightbulb,
  Mail,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import type { NavigationItem } from "@toolpad/core";
import { AppProvider } from "@toolpad/core";
import type { JSX } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

const HeaderWithBackButton = () => {
  const navigate = useNavigate();
  // const location = useLocation();

  const { id } = useParams();

  const returnToPropertyOverview = () => {
    navigate(`/property/${id}`); // Navigate to property overview
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "100%" }}
    >
      <IconButton
        onClick={returnToPropertyOverview}
        color="primary"
        sx={{ marginRight: 2 }}
        aria-label="go back"
      >
        <KeyboardReturn />
      </IconButton>
    </Box>
  );
};

export default function App(): JSX.Element {
  const location = useLocation();
  const { id } = useParams();
  console.log(location);

  const HOME_NAVIGATION: NavigationItem[] = [
    { segment: "guide", title: "Guide to Selling", icon: <Lightbulb /> },
    { segment: "edit", title: "Edit Account", icon: <Edit /> },
    {
      segment: "conveyancer",
      title: "Recommended Conveyancer",
      icon: <Gavel />,
    },
  ];

  const PROPERTY_NAVIGATION: NavigationItem[] = [
    {
      segment: `/property/${id}`,
      title: "Overview",
      icon: <Dashboard />,
    },
    {
      segment: `/property/${id}/orders`,
      title: "Orders",
      icon: <ShoppingCart />,
    },
    {
      segment: `/property/${id}/forms`,
      title: "Forms & Downloads",
      icon: <Description />,
    },
    {
      segment: `/property/${id}/enquiries`,
      title: "Enquiries",
      icon: <Mail />,
    },
    {
      segment: `/property/${id}/delete`,
      title: "Delete Property",
      icon: <Delete />,
    },
  ];

  const isEditOrCreatePath =
    location.pathname.includes("/create") ||
    location.pathname.includes("/edit");

  const navigationToUse = location.pathname.startsWith("/property")
    ? PROPERTY_NAVIGATION
    : HOME_NAVIGATION;

  return (
    <AppProvider
      navigation={isEditOrCreatePath ? undefined : navigationToUse}
      branding={
        isEditOrCreatePath ? { logo: <HeaderWithBackButton /> } : undefined
      }
    >
      <Outlet />
    </AppProvider>
  );
}
