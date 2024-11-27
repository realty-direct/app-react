import { KeyboardReturn } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const HeaderWithBackButton = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const returnToPropertyOverview = () => {
    if (!id) {
      console.error("Property ID is missing.");
      return;
    }
    console.log("Navigating to: ", `/property/${id}`);
    navigate(`/property/${id}`); // Use absolute path for navigation
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "100%" }}
    >
      <NavLink to={`/property/${id}`} style={{ textDecoration: "none" }}>
        <IconButton
          //   onClick={returnToPropertyOverview}
          color="primary"
          sx={{ marginRight: 2 }}
          aria-label="go back"
        >
          <KeyboardReturn />
        </IconButton>
      </NavLink>
    </Box>
  );
};

export default HeaderWithBackButton;
