import { KeyboardReturn } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const HeaderWithBackButton = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent any default behavior
    if (location.pathname.includes("create")) {
      navigate("/");
    } else {
      // TODO: Fix this it does not work. Could be because it is initialised before the router?
      // navigate(-1) will work but I dont think it is best practise.
      navigate(`/property/${id}`); // Navigate to the property page
    }
  };

  // TODO: Should make this a save and exit button maybe?

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      sx={{ width: "100%" }}
    >
      <IconButton
        onClick={handleNavigate}
        color="primary"
        sx={{ marginRight: 2 }}
        aria-label="go back"
      >
        <KeyboardReturn />
        {
          // TODO: Make this a save and exit button
        }
      </IconButton>
    </Box>
  );
};

export default HeaderWithBackButton;
