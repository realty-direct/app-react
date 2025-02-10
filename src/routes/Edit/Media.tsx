import {
  Box,
  Button,
  FormControlLabel,
  Input,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Media() {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [floorPlanFiles, setFloorPlanFiles] = useState<File[]>([]);
  const [videoURL, setVideoURL] = useState("");

  // Handles file selection for photos
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      if (photoFiles.length + filesArray.length <= 36) {
        setPhotoFiles([...photoFiles, ...filesArray]);
      } else {
        alert("You can only upload up to 36 photos.");
      }
    }
  };

  // Handles file selection for floor plans
  const handleFloorPlanUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setFloorPlanFiles([...floorPlanFiles, ...filesArray]);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Photos and Media
      </Typography>

      <Typography sx={{ mb: 2 }}>
        For best results, we recommend a resolution of <b>2000 x 1500 pixels</b>{" "}
        or higher, in a standard <b>4:3 ratio</b>.
      </Typography>
      <Typography sx={{ mb: 3 }}>
        (Limit <b>36</b> photos)
      </Typography>

      {/* Upload Photos Section */}
      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Upload photo(s)</Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Move your mouse over the photos to rotate and delete.
        </Typography>
        <Input
          type="file"
          onChange={handlePhotoUpload}
          sx={{ display: "none" }}
          id="photo-upload"
        />
        <label htmlFor="photo-upload">
          <Button variant="contained" component="span">
            Drop your image here / Choose file
          </Button>
        </label>
      </Paper>

      {/* Professional Photography Add-On */}
      <FormControlLabel
        control={<Radio />}
        label="Add Professional Photography and Retouching to your cart ($350.00)"
      />

      {/* Video Upload Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        The video needs to be uploaded to YouTube
      </Typography>

      <TextField
        label="Video URL (External Link)"
        variant="filled"
        fullWidth
        value={videoURL}
        onChange={(e) => setVideoURL(e.target.value)}
        sx={{ mb: 3 }}
      />

      {/* 3D Virtual Tour Add-On */}
      <FormControlLabel
        control={<Radio />}
        label="Add 3D Virtual Tours to your cart ($385.00)"
      />

      {/* Upload Floor Plan Section */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Upload floor plan(s)
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", border: "1px dashed gray", mb: 3 }}
      >
        <Typography variant="subtitle1">Drop your image here</Typography>
        <Input
          type="file"
          onChange={handleFloorPlanUpload}
          sx={{ display: "none" }}
          id="floorplan-upload"
        />
        <label htmlFor="floorplan-upload">
          <Button variant="contained" component="span">
            Choose file
          </Button>
        </label>
      </Paper>

      {/* Professional 2D Floor Plan Add-On */}
      <FormControlLabel
        control={<Radio />}
        label="Add Professional 2D full color Floorplan to your cart ($120.00)"
      />
    </Box>
  );
}
