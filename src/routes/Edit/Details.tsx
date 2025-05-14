import {
  Box,
  FormControlLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  Grid,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router"; // ✅ Import useParams
import useRealtyStore from "../../store/store"; // ✅ Import Zustand store
import type { PropertyDetail } from "../../store/types";
import { KingBed, Bathtub, DirectionsCar } from "@mui/icons-material";

export default function DetailsTab() {
  const { id: propertyId } = useParams<{ id: string }>();
  const { propertyDetails, updatePropertyDetail: updatePropertyDetailInStore } =
    useRealtyStore(); // ✅ Changed function name to avoid confusion

  const [landUnit, setLandUnit] = useState("m²"); // ✅ Default to m²
  const [houseUnit, setHouseUnit] = useState("m²"); // ✅ Default to m²

  // ✅ Find the correct property details by `propertyId`
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  if (!propertyDetail)
    return <Typography>No details found for this property.</Typography>;

  const handleChange = (key: keyof PropertyDetail, value: string | number) => {
    if (!propertyId) return;
    updatePropertyDetailInStore(propertyId, { [key]: value }); // ✅ Only updates Zustand, no network request
  };

  const formatNumberInput = (value: string) =>
    value.replace(/[^\d.]/g, "").replace(/^(\d*\.\d*)\./g, "$1"); // ✅ Allows only one decimal

  const handleIntegerInput = (value: string) => {
    // Only allow integers (no decimals)
    return value.replace(/[^\d]/g, "");
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Tell us more about your property
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Property Category
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Select the category that best describes your property
        </Typography>

        <TextField
          select
          label="Property Category"
          variant="outlined"
          fullWidth
          value={propertyDetail.property_category || ""}
          onChange={(e) => handleChange("property_category", e.target.value)}
        >
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="industrial">Industrial</MenuItem>
          <MenuItem value="rural">Rural</MenuItem>
        </TextField>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Property Features
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Enter the number of bedrooms, bathrooms, and car spaces
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bedrooms"
              variant="outlined"
              fullWidth
              type="text"
              value={propertyDetail.bedrooms || ""}
              onChange={(e) => 
                handleChange("bedrooms", handleIntegerInput(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KingBed color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bathrooms"
              variant="outlined"
              fullWidth
              type="text"
              value={propertyDetail.bathrooms || ""}
              onChange={(e) => 
                handleChange("bathrooms", handleIntegerInput(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Bathtub color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Car Spaces"
              variant="outlined"
              fullWidth
              type="text"
              value={propertyDetail.car_spaces || ""}
              onChange={(e) => 
                handleChange("car_spaces", handleIntegerInput(e.target.value))
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DirectionsCar color="primary" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Property Dimensions
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Enter the land and house area measurements
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="Land Area"
              variant="outlined"
              fullWidth
              value={propertyDetail.land_area?.split(" ")[0] || ""}
              onChange={(e) =>
                handleChange("land_area", formatNumberInput(e.target.value))
              }
              sx={{ flex: 1 }}
            />
            <Select
              value={propertyDetail.land_unit || landUnit}
              onChange={(e) => {
                setLandUnit(e.target.value);
                handleChange("land_unit", e.target.value);
              }}
              variant="outlined"
              sx={{ width: "auto", flexShrink: 0, ml: -1 }}
            >
              <MenuItem value="m²">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>

          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="House Area"
              variant="outlined"
              fullWidth
              value={propertyDetail.house_area?.split(" ")[0] || ""}
              onChange={(e) =>
                handleChange("house_area", formatNumberInput(e.target.value))
              }
              sx={{ flex: 1 }}
            />
            <Select
              value={propertyDetail.house_unit || houseUnit}
              onChange={(e) => {
                setHouseUnit(e.target.value);
                handleChange("house_unit", e.target.value);
              }}
              variant="outlined"
              sx={{ width: "auto", flexShrink: 0, ml: -1 }}
            >
              <MenuItem value="m²">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Property Type
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Select whether this is a new or established property
        </Typography>

        <RadioGroup
          row
          sx={{ gap: 2 }}
          value={propertyDetail.property_type || ""}
          onChange={(e) => handleChange("property_type", e.target.value)}
        >
          <FormControlLabel value="new" control={<Radio />} label="New" />
          <FormControlLabel
            value="established"
            control={<Radio />}
            label="Established"
          />
        </RadioGroup>
      </Paper>
    </Box>
  );
}
