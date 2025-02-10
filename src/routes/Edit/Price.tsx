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
import { useState } from "react";

export default function Price() {
  const [price, setPrice] = useState("");
  const [priceDisplay, setPriceDisplay] = useState("same");
  const [saleType, setSaleType] = useState("standard");

  // Function to format input as currency
  const formatCurrency = (value: string) => {
    if (!value) return ""; // Keep input blank when empty
    const num = Number(value.replace(/\D/g, "")); // Remove non-numeric characters
    return num ? `$${num.toLocaleString()}` : ""; // Convert to $ formatted string
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
          value={price}
          onChange={(e) => {
            const formattedPrice = formatCurrency(e.target.value);
            setPrice(formattedPrice);
          }}
          sx={{ mb: 3 }}
        />
      </Paper>

      {/* Price Display Options */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Typography sx={{ mb: 1 }}>
          How would you like to display the price?
        </Typography>
        <RadioGroup
          value={priceDisplay}
          onChange={(e) => setPriceDisplay(e.target.value)}
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
          value={saleType}
          onChange={(e) => setSaleType(e.target.value)}
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
