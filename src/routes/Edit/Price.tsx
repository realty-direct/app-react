import { AttachMoney, CalendarMonth } from "@mui/icons-material";
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
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
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
    propertyDetail?.show_price ?? true
  );

  if (!propertyDetail)
    return <Typography>Loading property details...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Set Your Property Price
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
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
          type="number"
          value={propertyDetail.price || ""}
          onChange={(e) =>
            updatePropertyDetail(propertyId, { price: e.target.value })
          }
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
                show_price: e.target.value === "true",
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

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Publishing Options
        </Typography>
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          Choose when you want your listing to go live on real estate websites.
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <RadioGroup
            value={propertyDetail.publish_option || "immediately"}
            onChange={(e) =>
              updatePropertyDetail(propertyId, {
                publish_option: e.target.value,
              })
            }
          >
            <FormControlLabel
              value="immediately"
              control={<Radio />}
              label="Publish immediately after payment"
            />
            <FormControlLabel
              value="later"
              control={<Radio />}
              label="Schedule for later"
            />
          </RadioGroup>

          {propertyDetail.publish_option === "later" && (
            <Box sx={{ mt: 2, ml: 4 }}>
              <DatePicker
                label="Select publish date"
                value={
                  propertyDetail.publish_date
                    ? new Date(propertyDetail.publish_date)
                    : null
                }
                onChange={(date) =>
                  updatePropertyDetail(propertyId, {
                    publish_date: date?.toISOString().split("T")[0],
                  })
                }
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                      ),
                    },
                  },
                }}
              />
            </Box>
          )}
        </FormControl>
      </Paper>
    </Box>
  );
}
