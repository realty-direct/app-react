import { MoreVert } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../database/supabase"; // ✅ Import Supabase client
import useRealtyStore from "../store/store";

export default function SidebarFooterAccountPopover() {
  const { profile: user, clearSession } = useRealtyStore(); // ✅ Extract user & clearSession
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const account = {
    id: user?.id ?? "guest",
    name: `${user?.first_name} ${user?.last_name}`.trim(),
    email: user?.email,
    color: "#3f51b5",
    image: null,
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigateToManageAccount = () => {
    navigate("/account");
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut(); // Logs user out from Supabase
      clearSession(); // Clears user session from Zustand
      navigate("/signin"); // Redirects to login page after session is cleared
      setAnchorEl(null); // Close the menu
    } catch (error) {
      console.error("❌ Logout failed:", error);
    }
  };

  return (
    <Stack direction="column">
      <Divider />
      <MenuList>
        <MenuItem
          sx={{
            justifyContent: "space-between",
            width: "100%",
            columnGap: 2,
          }}
          onClick={handleMenuOpen}
        >
          <Stack direction="row" alignItems="center" spacing={2} p={0.25}>
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: "0.95rem",
                  bgcolor: account.color,
                }}
                src={account.name}
              >
                {account.name[0]}
              </Avatar>
            </ListItemIcon>
            <ListItemText
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
              primary={account.name}
              secondary={account.email}
              primaryTypographyProps={{ variant: "body2" }}
              secondaryTypographyProps={{ variant: "caption" }}
            />
          </Stack>
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </MenuItem>
      </MenuList>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleNavigateToManageAccount}>
          Manage Account
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <LogoutIcon sx={{ mr: 1 }} />
            <Typography>Log out</Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Stack>
  );
}
