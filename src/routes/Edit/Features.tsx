import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid2,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import type { FeatureType } from "../../store/slices/features.slice";
import useRealtyStore from "../../store/store";
import type { PropertyFeature } from "../../store/types";

// Strictly typed feature categories (matches Supabase)
const features: Record<FeatureType, string[]> = {
  inside: [
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
  heating_cooling: [
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
  eco_friendly: [
    "Grey Water System",
    "Solar Hot Water",
    "Solar Panels",
    "Water Tank",
  ],
  outdoor: [
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

export default function FeaturesTab() {
  const { id: propertyId } = useParams<{ id: string }>();
  const { propertyFeatures, toggleFeatureSelection } = useRealtyStore();

  if (!propertyId) return <Typography>No property selected.</Typography>;

  const handleFeatureToggle = (feature: Omit<PropertyFeature, "id">) => {
    toggleFeatureSelection(propertyId, feature); // ✅ No need to add `id`
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Select Features for Your Property
      </Typography>

      <Grid2 container spacing={3}>
        {Object.entries(features).map(([category, items]) => {
          const featureType = category as FeatureType;

          return (
            <Grid2 key={category}>
              <Typography variant="h6" gutterBottom>
                {category === "inside"
                  ? "Inside"
                  : category === "heating_cooling"
                    ? "Heating & Cooling"
                    : category === "eco_friendly"
                      ? "Eco-Friendly"
                      : "Outdoor"}
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {items.map((item) => {
                const isChecked = propertyFeatures.some(
                  (f) => f.property_id === propertyId && f.feature_name === item
                );

                const feature: Omit<PropertyFeature, "id"> = {
                  property_id: propertyId,
                  feature_type: featureType,
                  feature_name: item,
                };

                return (
                  <FormControlLabel
                    key={item}
                    control={
                      <Checkbox
                        checked={isChecked}
                        onChange={() => handleFeatureToggle(feature)}
                      />
                    }
                    label={item}
                  />
                );
              })}
            </Grid2>
          );
        })}
      </Grid2>
    </Box>
  );
}
