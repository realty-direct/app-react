import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import type { JSX } from "react";
import { useParams } from "react-router-dom";

export default function Edit(): JSX.Element {
  const { id } = useParams(); // Access the property ID from the URL

  return (
    <Box>
      <Typography variant="h5">Edit Property {id}</Typography>
      <form>
        <TextField
          label="Property Name"
          fullWidth
          margin="normal"
          defaultValue={`Property ${id}`}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </Box>
  );
}
