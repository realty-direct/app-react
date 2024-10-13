import { Box, Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function RealtySideBar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}): JSX.Element {
  return (
    <Drawer
      open={isOpen}
      onClose={toggleSidebar}
      variant="persistent" // Use "temporary" for mobile
      sx={{ width: 240 }}
    >
      <Box sx={{ width: 240 }}>
        <List></List>
      </Box>
    </Drawer>
  );
}
