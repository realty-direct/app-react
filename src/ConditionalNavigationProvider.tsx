import {
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  Lightbulb,
  Mail,
} from "@mui/icons-material";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import type { Navigation } from "@toolpad/core/AppProvider";
import { AppProvider } from "@toolpad/core/react-router-dom";
import type React from "react";
import { useLocation } from "react-router-dom";
import useStore from "./store/store";

export default function ConditionalNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = useStore();
  const currentPropertyId = store.selectedProperty;
  const location = useLocation();

  // Define paths for conditional navigation
  const noNavigationPaths = ["/login", "/signup"];
  const minimalNavigationPaths = ["/create"];
  const propertyNavigationPaths = [
    "/property",
    "/orders",
    "/forms",
    "/enquiries",
  ];

  // Default home navigation
  const HOME_NAVIGATION: Navigation = [
    { segment: "guide", title: "Guide to Selling", icon: <Lightbulb /> },
    { segment: "edit", title: "Edit Account", icon: <Edit /> },
    {
      segment: "conveyancer",
      title: "Recommended Conveyancer",
      icon: <Gavel />,
    },
  ];

  // Property-specific navigation
  const PROPERTY_NAVIGATION: Navigation = currentPropertyId
    ? [
        {
          segment: "",
          title: "Back to Dashboard",
          icon: <KeyboardReturnIcon />,
        },
        { kind: "divider" },
        {
          segment: `property/${currentPropertyId}`,
          title: "Overview",
          icon: <Dashboard />,
        },
        {
          segment: `orders/${currentPropertyId}`,
          title: "Orders",
          icon: <ShoppingCartIcon />,
        },
        { segment: "forms", title: "Forms & Downloads", icon: <Description /> },
        {
          segment: `enquiries/${currentPropertyId}`,
          title: "Enquiries",
          icon: <Mail />,
        },
        {
          // TODO: Need to figure this out to run a WS call to delete the property.
          segment: `delete/${currentPropertyId}`,
          title: "Delete Property",
          icon: <Delete />,
        },
      ]
    : [];

  // Helper function to check if a route matches any of the specified paths
  const matchesPath = (paths: string[], currentPath: string) =>
    paths.some((path) => currentPath.startsWith(path));

  // Determine the navigation based on the current path
  let filteredNavigation: Navigation = [];

  if (matchesPath(noNavigationPaths, location.pathname)) {
    filteredNavigation = []; // No navigation for login/signup pages
  } else if (matchesPath(minimalNavigationPaths, location.pathname)) {
    filteredNavigation = [
      {
        segment: "",
        title: "Back to Dashboard",
        icon: <KeyboardReturnIcon />,
      },
    ];
  } else if (matchesPath(propertyNavigationPaths, location.pathname)) {
    filteredNavigation = PROPERTY_NAVIGATION; // Property-specific navigation
  } else {
    filteredNavigation = HOME_NAVIGATION; // Default navigation
  }

  return <AppProvider navigation={filteredNavigation}>{children}</AppProvider>;
}
