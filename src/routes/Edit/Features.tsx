import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid2,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Features() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Handle feature selection
  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const features = {
    "Inside Features": [
      "Broadband Connection",
      "Built In Robes",
      "Dishwasher",
      "Ducted Vacuum System",
      "Floor Boards",
      "Gym",
      "Intercom",
      "Open Fire Place",
      "Pay TV",
      "Rumpus Room",
      "Study",
    ],
    "Heating / Cooling Features": [
      "A/C",
      "Ducted Cooling",
      "Ducted Heating",
      "Evaporative Cooling",
      "Gas Heating",
      "Hydronic Heating",
      "Reverse Cycle Air Conditioning",
      "Split System Air Conditioning",
      "Split System Heating",
    ],
    "Eco-Friendly Features": [
      "Grey Water System",
      "Solar Hot Water",
      "Solar Panels",
      "Water Tank",
    ],
    "Outdoor Features": [
      "Above ground Pool",
      "Above ground Spa",
      "Alarm",
      "Balcony",
      "Courtyard",
      "Deck",
      "Fully Fenced",
      "Inground Pool",
      "Inground Spa",
      "Outdoor Entertainment Area",
      "Outside Spa",
      "Remote Control Garage",
      "Secure Parking",
      "Shed",
      "Tennis Court",
      "Workshop",
    ],
  };

  return (
    <Box p={3}>
      <Typography variant="h5" mb={2}>
        What features does your property have?
      </Typography>

      {/* Features Checklist */}
      <Grid2 container spacing={3}>
        {Object.entries(features).map(([category, items]) => (
          <Grid2 key={category}>
            <Typography variant="h6" gutterBottom>
              {category}
            </Typography>
            <Divider />
            {items.map((item) => (
              <FormControlLabel
                key={item}
                control={
                  <Checkbox
                    checked={selectedFeatures.includes(item)}
                    onChange={() => handleFeatureToggle(item)}
                  />
                }
                label={item}
              />
            ))}
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
