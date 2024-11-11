import { Download, Home } from "@mui/icons-material";
import {
  Box,
  Link,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useLocation } from "react-router-dom";

export interface DrawerOptions {
  text: string;
  icon: JSX.Element;
  href: string;
  id: number;
}

export default function SideBarOptions(): JSX.Element {
  const drawerOptions: DrawerOptions[] = [
    {
      id: 1,
      text: "Home",
      icon: <Home color="primary" />,
      href: "/",
    },
    {
      id: 2,
      text: "Forms",
      icon: <Download color="primary" />,
      href: "/forms",
    },
  ];
  const currentRoute = useLocation();
  console.log(currentRoute);

  return (
    <>
      {drawerOptions.map((option) => (
        <Link
          key={option.id}
          href={option.href}
          color="inherit"
          underline="none"
        >
          <ListItem disablePadding>
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
        </Link>
      ))}
    </>
  );
}
