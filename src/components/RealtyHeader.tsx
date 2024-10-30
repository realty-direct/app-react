import MenuIcon from "@mui/icons-material/Menu";
import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

interface HeaderProps {
  isSmallScreen: boolean;
  toggleSidebar: () => void;
}

const Header = ({ isSmallScreen, toggleSidebar }: HeaderProps) => (
  <AppBar position="static">
    <Toolbar sx={{ display: "flex", alignItems: "center" }}>
      {isSmallScreen && (
        <IconButton edge="start" color="inherit" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      )}
      <Typography variant="h6" sx={{ ml: isSmallScreen ? 1 : 0 }}>
        App Title
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
