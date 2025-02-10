import { Box, Button, Input, Paper, Typography } from "@mui/material";
import { useState } from "react";

export default function Ownership() {
  const [files, setFiles] = useState<File[]>([]);

  // Handles file selection
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFiles([...files, ...filesArray]);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Ownership Verification
      </Typography>

      <Typography sx={{ mb: 2 }}>
        Ownership verification is required before we can send your property ad
        live. To ensure there are no delays, provide this now if you can. If you
        don't have this on hand, feel free to continue for now and supply this
        later.
      </Typography>

      {/* Upload Section */}
      <Typography sx={{ mt: 3, mb: 1 }}>
        Please upload a rates notice to verify your ownership of the property
        you’re listing and its legal address.
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Upload file(s)</Typography>
        <Input
          type="file"
          onChange={handleFileUpload}
          sx={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button variant="contained" component="span">
            Choose file
          </Button>
        </label>
      </Paper>
    </Box>
  );
}
