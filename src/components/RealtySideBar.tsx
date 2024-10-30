import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useLocation } from "react-router-dom";

export default function RealtySideBar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}): JSX.Element {
  const location = useLocation();
  const hideSidebarPaths = ["/signin", "/signup"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
  console.log(shouldHideSidebar);
  const drawerOptions = ["test1", "test2", "test3", "test4"];

  if (shouldHideSidebar) {
    return <></>;
  }

  return (
    <Drawer
      open={isOpen}
      onClose={toggleSidebar}
      variant="persistent" // Use "temporary" for mobile
      sx={{ width: 240 }}
    >
      <Box sx={{ width: 240 }}>
        <List>
          {drawerOptions.map((text, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton>
                {/* <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon> */}
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
