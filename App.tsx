import { createTheme } from "@mui/material";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet } from "react-router";
import "./src/App.css";
import HeaderWithBackButton from "./src/components/EditPropertyHeader";
import { useNavigationConfig } from "./src/lib/navigation";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        background: {},
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
        background: {},
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default function App() {
  const { isEditOrCreatePath, navigationToUse } = useNavigationConfig();

  return (
    <ReactRouterAppProvider
      navigation={isEditOrCreatePath ? undefined : navigationToUse}
      branding={
        isEditOrCreatePath ? { logo: <HeaderWithBackButton /> } : undefined
      }
      theme={theme}
    >
      <div className="main-outlet">
        <Outlet />
      </div>
    </ReactRouterAppProvider>
  );
}
