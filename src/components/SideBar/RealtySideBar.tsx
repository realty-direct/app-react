import { Box, Button, Drawer, List, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { default as DefaultSideBarOptions } from "./DefaultSideBarOptions";
import PropertySideBarOptions from "./PropertySideBarOptions";

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: SidebarProps): JSX.Element {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const location = useLocation(); // Get current location

  const onLogout = () => {
    // Implement logout logic here
  };

  // Extract the property ID from the current URL dynamically
  const match = location.pathname.match(/\/property\/([^/]+)/);
  const propertyId = match ? match[1] : null;

  // Define route-specific sidebar items for Property

  return (
    <Drawer
      open={isOpen}
      onClose={toggleSidebar}
      variant={isSmallScreen ? "temporary" : "persistent"}
      sx={{
        width: isSmallScreen ? "auto" : 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSmallScreen ? "50%" : 240,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          textAlign: "center",
          height: "5vh", // Adjust to match header height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          borderBottom: "1px solid #ccc",
        }}
      >
        <img
          src={logo}
          alt="App Logo"
          style={{ height: "100%", width: "100%" }}
        />
      </Box>

      {/* Sidebar Options Section */}
      <Box sx={{ width: "100%", flexGrow: 1 }}>
        <List>
          {propertyId ? <PropertySideBarOptions /> : <DefaultSideBarOptions />}
        </List>
      </Box>
      {/* Logout Section */}
      <Box
        sx={{
          textAlign: "center",
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="subtitle1">{"userName"}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onLogout}
          sx={{ mt: 1 }}
        >
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}
