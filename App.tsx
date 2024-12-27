import {
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  Lightbulb,
  Mail,
  ShoppingCart,
} from "@mui/icons-material";
import type { NavigationItem } from "@toolpad/core";
import { AppProvider } from "@toolpad/core";
import type { JSX } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import HeaderWithBackButton from "./src/components/EditPropertyHeader";

export default function App(): JSX.Element {
  const location = useLocation();
  const { id } = useParams();

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
