import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../assets/Realty_Direct_Logo.png";

export interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  drawerOptions: string[];
}

const Sidebar = ({ isOpen, toggleSidebar, drawerOptions }: SidebarProps) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Drawer
      open={isOpen}
      onClose={toggleSidebar}
      variant={isSmallScreen ? "temporary" : "persistent"}
      sx={{
        width: isSmallScreen ? "auto" : 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isSmallScreen ? "80%" : 240,
        },
      }}
    >
      <div
        className="logo-container"
        style={{ textAlign: "center", width: "100%" }}
      >
        <img
          src={logo}
          alt="App Logo"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      <Box sx={{ width: "100%" }}>
        <List>
          {drawerOptions.map((text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
