import { AttachMoney } from "@mui/icons-material";
import {
  Box,
  FormControl,
  FormControlLabel,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Price() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";
  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const [showPrice, setShowPrice] = useState(
    propertyDetail?.price_display === "show" ? true : false
  );
  
  const [formattedPrice, setFormattedPrice] = useState("");

  useEffect(() => {
    if (propertyDetail?.price) {
      setFormattedPrice(formatNumberWithCommas(propertyDetail.price));
    } else {
      setFormattedPrice("");
    }
  }, [propertyDetail?.price]);

  const formatNumberWithCommas = (value: number | string) => {
    const numericValue = String(value).replace(/[^\d]/g, "");
    
    if (!numericValue) return "";
    
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rawValue = inputValue.replace(/,/g, "");
    setFormattedPrice(formatNumberWithCommas(rawValue));
    updatePropertyDetail(propertyId, { price: rawValue ? Number(rawValue) : null });
  };

  if (!propertyDetail)
    return <Typography>Loading property details...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Set Your Property Price
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Price Details
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Enter the price you want to list your property for. You can choose to
          display or hide this price from buyers.
        </Typography>

        <TextField
          label="Property Price"
          variant="outlined"
          fullWidth
          type="text"
          value={formattedPrice}
          onChange={handlePriceChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AttachMoney />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <FormControl component="fieldset">
          <RadioGroup
            value={showPrice}
            onChange={(e) => {
              setShowPrice(e.target.value === "true");
              updatePropertyDetail(propertyId, {
                price_display: e.target.value === "true" ? "show" : "hide",
              });
            }}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Display price to buyers"
            />
            <FormControlLabel
              value={false}
              control={<Radio />}
              label="Hide price from buyers (Contact Agent)"
            />
          </RadioGroup>
        </FormControl>
      </Paper>
    </Box>
  );
}
