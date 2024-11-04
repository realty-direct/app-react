import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/logo.png";
import { DrawerOptions } from "../routes/RootView";

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  drawerOptions: DrawerOptions[];
}

const Sidebar = ({ isOpen, toggleSidebar, drawerOptions }: SidebarProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const onLogout = () => {
    // Implement logout logic here
  };

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
      <Box
        sx={{
          textAlign: "center",
          height: "5vh", // Adjust to match header height
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <img
          src={logo}
          alt="App Logo"
          style={{ height: "100%", width: "100%" }} // Ensures full height utilization
        />
      </Box>

      <Box sx={{ width: "100%", flexGrow: 1 }}>
        <List>
          {drawerOptions.map((option, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {option.icon}
                </Box>
                <ListItemText primary={option.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
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
};

export default Sidebar;
