import {
  Alert,
  Box,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router";
import useRealtyStore from "../../store/store";
import type { PropertyDetail } from "../../store/types";

export default function Price() {
  const { id: propertyId } = useParams<{ id: string }>();
  const { propertyDetails, updatePropertyDetail: updatePropertyDetailInStore } =
    useRealtyStore();

  // Get the correct property details
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  if (!propertyDetail)
    return <Typography>No details found for this property.</Typography>;

  // Function to format a number as currency (UI display only)
  const formatCurrency = (value: number | string) => {
    const num = Number(value);
    return num ? `$${num.toLocaleString()}` : "";
  };

  // Function to update Zustand & remove formatting for storage
  const handleUpdate = (key: keyof PropertyDetail, value: string) => {
    if (!propertyId) return;

    let formattedValue: string | number = value;

    // Convert price to a number for storage
    if (key === "price") {
      formattedValue = Number(value.replace(/\D/g, "")) || 0;
    }

    updatePropertyDetailInStore(propertyId, { [key]: formattedValue });
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Price
        </Typography>

        <Alert sx={{ mb: 2 }}>
          A price is required by realestate.com.au as they use it for sorting
          and search filtering.
        </Alert>

        {/* Price Input Field with $ Formatting */}
        <TextField
          label="Enter a price"
          variant="filled"
          fullWidth
          value={formatCurrency(propertyDetail.price || "")} // Convert raw number to "$123,000"
          onChange={(e) => handleUpdate("price", e.target.value)}
          sx={{ mb: 3 }}
        />
      </Paper>

      {/* Price Display Options */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography sx={{ mb: 1 }}>
          How would you like to display the price?
        </Typography>
        <RadioGroup
          value={propertyDetail.price_display || "same"}
          onChange={(e) => handleUpdate("price_display", e.target.value)}
          sx={{ gap: 1 }}
        >
          <FormControlLabel
            value="same"
            control={<Radio />}
            label="Same as above price"
          />
          <FormControlLabel
            value="hide"
            control={<Radio />}
            label="Hide the price"
          />
          <FormControlLabel
            value="range"
            control={<Radio />}
            label="Price range"
          />
          <FormControlLabel
            value="custom"
            control={<Radio />}
            label="Custom price"
          />
        </RadioGroup>
      </Paper>

      {/* Sale Type Options */}
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography sx={{ mt: 3, mb: 1 }}>Sale Type</Typography>
        <RadioGroup
          value={propertyDetail.sale_type || "standard"}
          onChange={(e) => handleUpdate("sale_type", e.target.value)}
          sx={{ gap: 1 }}
        >
          <FormControlLabel
            value="standard"
            control={<Radio />}
            label="Standard Sale"
          />
          <FormControlLabel
            value="auction"
            control={<Radio />}
            label="Auction"
          />
        </RadioGroup>
      </Paper>
    </Box>
  );
}
