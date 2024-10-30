import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

export default function RealtySideBar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}): JSX.Element {
  const drawerOptions = ["test1", "test2", "test3", "test4"];

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
