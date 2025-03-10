import {
  Box,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router"; // ✅ Import useParams
import useRealtyStore from "../../store/store"; // ✅ Import Zustand store
import type { PropertyDetail } from "../../store/types";

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

  const handleChange = (key: keyof PropertyDetail, value: string) => {
    if (!propertyId) return;
    updatePropertyDetailInStore(propertyId, { [key]: value }); // ✅ Only updates Zustand, no network request
  };

  const formatNumberInput = (value: string) =>
    value.replace(/[^\d.]/g, "").replace(/^(\d*\.\d*)\./g, "$1"); // ✅ Allows only one decimal

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Tell us more about your property
      </Typography>

      {/* Inputs Section */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, my: 4 }}>
        {/* Property Category */}
        <TextField
          select
          label="Property Category"
          variant="filled"
          fullWidth
          value={propertyDetail.property_category || ""}
          onChange={(e) => handleChange("property_category", e.target.value)}
        >
          <MenuItem value="residential">Residential</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="industrial">Industrial</MenuItem>
          <MenuItem value="rural">Rural</MenuItem>
        </TextField>

        {/* Land Area and House Area */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {/* Land Area */}
          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="Land Area"
              type="text"
              variant="filled"
              fullWidth
              value={propertyDetail.land_area?.split(" ")[0] || ""} // ✅ Show only the number
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
              variant="filled"
              sx={{
                width: "auto",
                flexShrink: 0,
                borderLeft: 1,
              }}
              hiddenLabel
            >
              <MenuItem value="m²">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>

          {/* House Area */}
          <Box sx={{ flex: 1, display: "flex", gap: 0 }}>
            <TextField
              label="House Area"
              type="text"
              variant="filled"
              fullWidth
              value={propertyDetail.house_area?.split(" ")[0] || ""} // ✅ Show only the number
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
              variant="filled"
              sx={{
                width: "auto",
                flexShrink: 0,
                borderLeft: 1,
              }}
              hiddenLabel
            >
              <MenuItem value="m²">m²</MenuItem>
              <MenuItem value="acres">Acres</MenuItem>
              <MenuItem value="hectares">Hectares</MenuItem>
              <MenuItem value="squares">Squares</MenuItem>
            </Select>
          </Box>
        </Box>
      </Box>

      {/* Radio Group */}
      <Typography sx={{ mb: 1 }}>Property Type</Typography>
      <RadioGroup
        row
        sx={{ gap: 2 }}
        value={propertyDetail.property_type || ""}
        onChange={(e) => handleChange("property_type", e.target.value)}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Radio value="new" />
          <Typography>New</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Radio value="established" />
          <Typography>Established</Typography>
        </Box>
      </RadioGroup>
    </Box>
  );
}
