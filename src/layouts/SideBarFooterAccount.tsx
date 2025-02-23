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
import { useNavigate } from "react-router-dom";
import useRealtyStore from "../store/store";

export default function SidebarFooterAccountPopover() {
  const { id, first_name, last_name, email } = useRealtyStore();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // ✅ State for menu
  const open = Boolean(anchorEl);

  // ✅ Define user account details
  const account = {
    id: id,
    name: `${first_name} ${last_name}`.trim(),
    email: email,
    color: "#3f51b5", // ✅ Default avatar color
    image: null, // ✅ If profile images are supported in the future
  };

  // ✅ Handle menu open/close
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

  return (
    <Stack direction="column">
      <Divider />
      <MenuList>
        <MenuItem
          sx={{
            justifyContent: "space-between", // ✅ Ensures spacing between avatar and three dots
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
                // alt={account.name}
              >
                {account.name[0]} {/* ✅ Display first letter of the name */}
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

          {/* ✅ Three Dots Button */}
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
        </MenuItem>
      </MenuList>
      {/* ✅ Dropdown Menu for Three Dots Button */}
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
        <MenuItem onClick={() => navigate("logout")}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center", // ✅ Aligns items vertically
              //   justifyContent: "center", // ✅ Centers the text while keeping icon on left
              width: "100%", // ✅ Ensures full width
            }}
          >
            <LogoutIcon sx={{ mr: 1 }} />
            {/* ✅ Adds spacing to the right of the icon */}
            <Typography>Log out</Typography> {/* ✅ Centered text */}
          </Box>
        </MenuItem>
      </Menu>
    </Stack>
  );
}
