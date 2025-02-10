import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Description() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Character limits
  const TITLE_LIMIT = 80;
  const DESCRIPTION_LIMIT = 5000;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Description
      </Typography>

      {/* Listing Title */}
      <Typography sx={{ mb: 1 }}>
        <b>Listing title (80 character limit)</b>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Your title needs to jump out at people and make them want to read more.
        Keep it short and descriptive, and focus on your property's strongest
        feature.
      </Typography>
      <TextField
        label="Enter Listing Title"
        variant="filled"
        fullWidth
        value={title}
        onChange={(e) => {
          if (e.target.value.length <= TITLE_LIMIT) {
            setTitle(e.target.value);
          }
        }}
        helperText={`${title.length} / ${TITLE_LIMIT} characters`}
        sx={{ mb: 3 }}
      />

      {/* Description Field */}
      <Typography sx={{ mb: 1 }}>
        <b>Description (5000 character limit)</b>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Try to include an opening statement, dot points of key features, a
        longer description of what living in the property is like, any nearby
        features, and a closing statement with a strong call to action.
      </Typography>
      <TextField
        label="Enter Property Description"
        variant="filled"
        fullWidth
        multiline
        rows={6}
        value={description}
        onChange={(e) => {
          if (e.target.value.length <= DESCRIPTION_LIMIT) {
            setDescription(e.target.value);
          }
        }}
        helperText={`${description.length} / ${DESCRIPTION_LIMIT} characters`}
        sx={{ mb: 3 }}
      />

      {/* Important Notice */}
      <Paper sx={{ p: 2, backgroundColor: "#f9f9f9", mb: 3 }}>
        <Typography variant="body2">
          <b>Important:</b> Don't put your contact details here as this is
          against realestate.com.au's acceptable use policy.
        </Typography>
      </Paper>

      {/* Professional Copywriting Service */}
      <FormControlLabel
        control={<Radio />}
        label="Let our professional copywriters handle it! ($120.00)"
      />
    </Box>
  );
}
