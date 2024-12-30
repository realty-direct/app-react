import {
  Box,
  Button,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function DetailsTab() {
  const [landUnit, setLandUnit] = useState("m2");
  const [houseUnit, setHouseUnit] = useState("m2");

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Tell us more about your property
      </Typography>

      {/* Inputs Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 4 }}>
        {/* Property Category */}
        <TextField select label="Property Category" variant="filled" fullWidth>
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="industrial">Industrial</MenuItem>
          <MenuItem value="rural">Rural</MenuItem>
        </TextField>

        {/* Land Area and House Area */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap", // Wraps inputs on smaller screens
            gap: 2,
          }}
        >
          {/* Land Area */}
          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="Land Area"
              type="number"
              variant="filled"
              fullWidth
              sx={{ flex: 1 }}
            />
            <Select
              value={landUnit}
              onChange={(e) => setLandUnit(e.target.value)}
              variant="filled"
              sx={{
                width: "auto", // Adapts to content
                flexShrink: 0, // Prevents it from shrinking too much
                borderLeft: 1,
              }}
              hiddenLabel
            >
              <MenuItem value="m2">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>

          {/* House Area */}
          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="House Area"
              type="number"
              variant="filled"
              fullWidth
              sx={{ flex: 1 }}
            />
            <Select
              value={houseUnit}
              onChange={(e) => setHouseUnit(e.target.value)}
              variant="filled"
              sx={{
                width: "auto", // Adapts to content
                flexShrink: 0, // Prevents it from shrinking too much
                borderLeft: 1,
              }}
              hiddenLabel
            >
              <MenuItem value="m2">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Radio Group */}
      <Typography sx={{ mb: 1 }}>Property Type</Typography>
      <RadioGroup row sx={{ gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Radio value="new" />
          <Typography>New</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Radio value="established" />
          <Typography>Established</Typography>
        </Box>
      </RadioGroup>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 6,
          flexWrap: "wrap", // Ensures buttons wrap on small screens
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            flex: "1 1 auto",
            maxWidth: "150px",
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            flex: "1 1 auto",
            maxWidth: "150px",
          }}
        >
          Continue
        </Button>
      </Box>

      {/* Note */}
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ mt: 4, textAlign: "center" }}
      >
        Please note: You can skip between sections anytime
      </Typography>
    </Box>
  );
}
