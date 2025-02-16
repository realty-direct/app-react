import {
  ArrowBack,
  Dashboard,
  Delete,
  Description,
  Edit,
  Gavel,
  House,
  Lightbulb,
  Mail,
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
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
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
