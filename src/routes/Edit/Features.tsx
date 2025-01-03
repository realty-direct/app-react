import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
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
      {/* Top Navigation Bar Note */}
      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
        Please note: You can skip between sections anytime by using the top
        Navigation bar
      </Typography>

      <Typography variant="h5" mb={2}>
        What features does your property have?
      </Typography>

      {/* Features Checklist */}
      <Grid container spacing={3}>
        {Object.entries(features).map(([category, items]) => (
          <Grid item xs={12} md={6} key={category}>
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
          </Grid>
        ))}
      </Grid>

      {/* Action Buttons */}
      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="outlined"
          color="primary"
          onClick={() => console.log("Back clicked")}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Continue clicked")}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
