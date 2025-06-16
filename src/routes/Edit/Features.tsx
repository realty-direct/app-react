import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import type { FeatureType } from "../../store/slices/features.slice";
import useRealtyStore from "../../store/store";
import type { PropertyFeature } from "../../store/types";

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

  const handleFeatureToggle = (
    featureName: string,
    featureType: FeatureType
  ) => {
    const feature: Omit<PropertyFeature, "id"> = {
      property_id: propertyId,
      feature_type: featureType,
      feature_name: featureName,
    };

    toggleFeatureSelection(propertyId, feature);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Select Features for Your Property
      </Typography>

      <Grid container spacing={3}>
        {Object.entries(features).map(([category, items]) => {
          const featureType = category as FeatureType;

          return (
            <Grid size={{ xs: 12, md: 6 }} key={category}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ textTransform: "capitalize" }}
                >
                  {category.replace("_", " ")}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {items.map((item) => {
                    const isChecked = propertyFeatures.some(
                      (f) =>
                        f.property_id === propertyId &&
                        f.feature_type === featureType &&
                        f.feature_name === item
                    );

                    return (
                      <FormControlLabel
                        key={item}
                        control={
                          <Checkbox
                            checked={isChecked}
                            onChange={() =>
                              handleFeatureToggle(item, featureType)
                            }
                          />
                        }
                        label={item}
                      />
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
