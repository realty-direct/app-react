import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

interface HeaderProps {
  isSmallScreen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSmallScreen, toggleSidebar }: HeaderProps) => (
  <AppBar position="static" sx={{ height: "5vh" }}>
    {/* Example: 10% of viewport height */}
    <Toolbar sx={{ minHeight: "100%", alignItems: "center", px: 2 }}>
      {isSmallScreen && (
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      )}
      <Typography variant="h6">App Title</Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
