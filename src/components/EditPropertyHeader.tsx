import { KeyboardReturn } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useNavigate } from "react-router";

const HeaderWithBackButton = () => {
  const navigate = useNavigate();

  const handleNavigate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent default link behavior
    navigate(-1); // Go
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
