import {
  ArrowBack,
  Dashboard,
  Delete,
  Description,
  Gavel,
  House,
  Lightbulb,
  Mail,
  Person,
  ShoppingCart,
} from "@mui/icons-material";
import { createTheme } from "@mui/material";
import type { Navigation, NavigationItem } from "@toolpad/core";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { type JSX, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import "./src/App.css";
import HeaderWithBackButton from "./src/components/EditPropertyHeader";
import { useRealtyStore } from "./src/store/store";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {
          // default: "#F9F9FE",
          // paper: "#EEEEF9",
        },
        success: {
          "500": "#2E7D32",
          "100": "#C8E6C9",
          "300": "#A5D6A7",
          "400": "#00c073",
        },
      },
    },
    dark: {
      palette: {
        background: {
          // default: "#2A4364",
          // paper: "#112E4D",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0, // Extra small devices (phones)
      sm: 600, // Small devices (tablets)
      md: 960, // Medium devices (small laptops)
      lg: 1280, // Large devices (desktops)
      xl: 1920, // Extra large screens (4K displays)
    },
  },
});

export default function App(): JSX.Element {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useRealtyStore();

  useEffect(() => {
    const publicRoutes = ["/signin", "/signup"];

    // ✅ Allow users to access "/signin" and "/signup" without redirecting
    if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
      navigate("/signin", { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  const HOME_NAVIGATION: NavigationItem[] = [
    { segment: "", title: "Your Properties", icon: <House /> },
    { segment: "guide", title: "Guide to Selling", icon: <Lightbulb /> },
    {
      segment: "conveyancing",
      title: "Recommended Conveyancer",
      icon: <Gavel />,
    },
    { kind: "divider" },
    {
      segment: "account",
      title: "Account Management",
      icon: <Person />,
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

  // ✅ Prevent rendering Outlet if user is not authenticated
  if (
    !isAuthenticated &&
    location.pathname !== "/signin" &&
    location.pathname !== "/signup"
  ) {
    return <></>; // Avoid rendering anything until navigation happens
  }

  return (
    <ReactRouterAppProvider
      navigation={isEditOrCreatePath ? undefined : navigationToUse}
      branding={
        isEditOrCreatePath ? { logo: <HeaderWithBackButton /> } : undefined
      }
      theme={theme}

      //  theme={} // https://mui.com/toolpad/core/react-app-provider/#theming
    >
      <div className="main-outlet">
        <Outlet />
      </div>
    </ReactRouterAppProvider>
  );
}

// TODO: Before production: https://supabase.com/docs/guides/deployment/going-into-prod
