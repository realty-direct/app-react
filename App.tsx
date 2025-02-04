import {
  ArrowBack,
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  Lightbulb,
  Mail,
  ShoppingCart,
} from "@mui/icons-material";
import type { Navigation, NavigationItem } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import type { JSX } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import "./src/App.css";
import HeaderWithBackButton from "./src/components/EditPropertyHeader";

export default function App(): JSX.Element {
  const location = useLocation();
  const { id } = useParams();

  const HOME_NAVIGATION: NavigationItem[] = [
    { segment: "", title: "Your Properties", icon: <Lightbulb /> },
    { segment: "guide", title: "Guide to Selling", icon: <Lightbulb /> },
    { segment: "edit", title: "Edit Account", icon: <Edit /> },
    {
      segment: "conveyancer",
      title: "Recommended Conveyancer",
      icon: <Gavel />,
    },
  ];

  const PROPERTY_NAVIGATION: Navigation = [
    {
      segment: ".",
      title: "Return to dashboard",
      icon: <ArrowBack />,
    },
    { kind: "divider" },

    {
      segment: `property/${id}`,
      title: "Overview",
      icon: <Dashboard />,
    },
    {
      segment: `property/${id}/orders`,
      title: "Orders",
      icon: <ShoppingCart />,
    },
    {
      segment: `property/${id}/forms`,
      title: "Forms & Downloads",
      icon: <Description />,
    },
    {
      segment: `property/${id}/enquiries`,
      title: "Enquiries",
      icon: <Mail />,
    },
    {
      segment: `property/${id}/delete`,
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
    <ReactRouterAppProvider
      navigation={isEditOrCreatePath ? undefined : navigationToUse}
      branding={
        isEditOrCreatePath ? { logo: <HeaderWithBackButton /> } : undefined
      }
    >
      <div className="main">
        <Outlet />
      </div>
    </ReactRouterAppProvider>
  );
}
