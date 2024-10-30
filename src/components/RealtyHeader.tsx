import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, Box, IconButton, Toolbar } from "@mui/material";
import logo from "../assets/logo_white.png";
interface HeaderProps {
  isSmallScreen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSmallScreen, toggleSidebar }: HeaderProps) => (
  <AppBar position="static" sx={{ height: "5vh" }}>
    <Toolbar sx={{ minHeight: "100%", alignItems: "center", px: 2 }}>
      {isSmallScreen && (
        <>
          <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                textAlign: "center",
                height: "5vh", // Matches header height
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
              }}
            >
              <img
                src={logo}
                alt="App Logo"
                style={{
                  height: "100%",
                  width: "auto",
                }}
              />
            </Box>
          </Box>
        </>
      )}
    </Toolbar>
  </AppBar>
);

export default Header;
