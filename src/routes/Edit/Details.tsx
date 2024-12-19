import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

export default function DetailsTab() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tell us more about your property
      </Typography>

      {/* Property Category */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Property Category*</InputLabel>
        <Select defaultValue="">
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="industrial">Industrial</MenuItem>
          <MenuItem value="rural">Rural</MenuItem>
        </Select>
      </FormControl>

      {/* Land Area */}
      <TextField
        fullWidth
        margin="normal"
        label="Land Area (m²)"
        type="number"
        InputProps={{
          inputProps: { min: 0 },
        }}
      />

      {/* House Area */}
      <TextField
        fullWidth
        margin="normal"
        label="House Area (m²)"
        type="number"
        InputProps={{
          inputProps: { min: 0 },
        }}
      />

      {/* Hide Street Address */}
      <FormControlLabel
        control={<Checkbox />}
        label="Hide my street address and just display the suburb"
      />

      {/* Property Type: New or Established */}
      <FormControl margin="normal">
        <RadioGroup row>
          <FormControlLabel value="new" control={<Radio />} label="New" />
          <FormControlLabel
            value="established"
            control={<Radio />}
            label="Established"
          />
        </RadioGroup>
      </FormControl>

      {/* Submit Button */}
      <Button variant="contained" color="primary">
        Save Details
      </Button>
    </Box>
  );
}
