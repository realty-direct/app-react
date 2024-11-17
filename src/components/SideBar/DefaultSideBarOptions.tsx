import { ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";

export default function DefaultSideBarOptions(): JSX.Element {
  return (
    <>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={"/"}>
          <ListItemText primary={"Guide to Selling"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={"/"}>
          <ListItemText primary={"Edit Account"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={"/"}>
          <ListItemText primary={"Recommended Conveyancer"} />
        </ListItemButton>
      </ListItem>
    </>
  );
}
