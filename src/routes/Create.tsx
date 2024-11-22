import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import { useState } from "react";

const STATES_IN_AUSTRALIA = [
  "ACT",
  "NSW",
  "NT",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
];

export default function Create(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);

  // Form data state
  const [propertyDetails, setPropertyDetails] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    description: "",
    images: [],
  });

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Handle form field changes for Property Details
  const handlePropertyDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    if (name) {
      setPropertyDetails((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit handler for the form
  const handleSubmit = () => {
    console.log("Property Details Submitted: ", propertyDetails);
    console.log("Additional Info Submitted: ", additionalInfo);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Back Button */}

      {/* Tabs for Navigation */}
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Property Details" />
        <Tab label="Additional Info" />
      </Tabs>

      {/* Tab Panels */}
      {tabIndex === 0 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Enter Property Details
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={propertyDetails.address}
              onChange={handlePropertyDetailsChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="City"
              name="city"
              value={propertyDetails.city}
              onChange={handlePropertyDetailsChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                name="state"
                value={propertyDetails.state}
                onChange={(e) =>
                  setPropertyDetails((prev) => ({
                    ...prev,
                    state: e.target.value as string, // Explicitly cast value to string
                  }))
                }
                label="State"
              >
                {STATES_IN_AUSTRALIA.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="ZIP Code"
              name="zip"
              value={propertyDetails.zip}
              onChange={handlePropertyDetailsChange}
              margin="normal"
            />
          </Box>
        </Box>
      )}

      {tabIndex === 1 && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Additional Information
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={additionalInfo.description}
              onChange={(e) =>
                setAdditionalInfo((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              margin="normal"
              multiline
              rows={4}
            />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Add Images (Coming Soon)
            </Typography>
          </Box>
        </Box>
      )}

      {/* Submit Button */}
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={tabIndex !== 1} // Only enable on the last tab
        >
          Submit Property
        </Button>
      </Box>
    </Box>
  );
}
