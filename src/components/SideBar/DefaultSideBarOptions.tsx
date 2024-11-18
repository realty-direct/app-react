import Add from "@mui/icons-material/Add";
import { Button, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function DefaultSideBarOptions(): JSX.Element {
  const navigate = useNavigate();

  const handleAddProperty = () => {
    navigate("/create");
  };

  return (
    <>
      <ListItem className="hidden">
        <Button
          variant="contained"
          sx={{
            backgroundColor: "rgb(110,240,145)", // Light green shade
            color: "#000",
            "&:hover": {
              backgroundColor: "rgb(100,240,145)", // Slightly darker green on hover
            },
            padding: 2,
            width: "100%",
          }}
          startIcon={<Add />}
          onClick={() => handleAddProperty()} // Replace with your navigation or add property logic
        >
          Add Property
        </Button>
      </ListItem>
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
