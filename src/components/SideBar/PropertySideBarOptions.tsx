import { Divider } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { Link, useLocation } from "react-router-dom";

export default function PropertySideBarOptions() {
  const location = useLocation(); // Get current location

  const match = location.pathname.match(/\/property\/([^/]+)/);

  const propertyId = match ? match[1] : null;

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={"/"}>
          <ListItemText primary={"Return to Dashboard"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton component={Link} to={`/property/${propertyId}`}>
          <ListItemText primary={"Overview"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={`/property/${propertyId}/orders`}>
          <ListItemText primary={"Orders"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={`/property/${propertyId}/forms`}>
          <ListItemText primary={"Forms & Downloads"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={`/property/${propertyId}/enquiries`}
        >
          <ListItemText primary={"Enquiries"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component={Link} to={`/property/${propertyId}/delete`}>
          <ListItemText primary={"Delete Property"} />
        </ListItemButton>
      </ListItem>
    </>
  );
}
