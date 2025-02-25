import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRealtyStore from "../store/store";

export default function Create(): JSX.Element {
  const navigate = useNavigate();
  const { addProperty, profile } = useRealtyStore(); // ✅ Zustand store
  const [propertyDetails, setPropertyDetails] = useState<{
    address: string;
    propertyType: "residential" | "commercial" | "land" | "rural" | "";
  }>({
    address: "",
    propertyType: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyDetails({ ...propertyDetails, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    if (!propertyDetails.address || !propertyDetails.propertyType) {
      setError("Please provide both an address and property type.");
      return;
    }

    setLoading(true);
    setError(null);
    if (!profile) return;
    try {
      const propertyId = await addProperty({
        user_id: profile.id,
        address: propertyDetails.address,
        property_type: propertyDetails.propertyType,
        status: "draft",
        price: 0,
        price_display: null,
        sale_type: null,
      });

      if (!propertyId) {
        setError("Failed to create property. Please try again.");
      } else {
        navigate(`/property/${propertyId}`); // ✅ Redirect to edit page
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="w-full">
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-300 shadow-md">
        <Tabs value={0} aria-label="Property details tab">
          <Tab label="Property Details" />
        </Tabs>
      </div>

      {/* Content Layout */}
      <div className="flex flex-col md:flex-row gap-6 mt-6 p-6">
        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <Typography variant="h6" gutterBottom>
            Enter Property Details
          </Typography>
          <Box component="form" noValidate className="mt-4">
            {/* Address Input */}
            <Box component="form" noValidate className="mt-4 relative">
              <TextField
                fullWidth
                label="Full Address"
                name="address"
                value={propertyDetails.address}
                onChange={handleInputChange}
                variant="outlined" // ✅ Explicitly define variant
              />
            </Box>

            {/* Map Placeholder */}
            <div className="mt-6 h-72 bg-gray-200 flex items-center justify-center rounded-md">
              <Typography variant="body1">Map Placeholder</Typography>
            </div>

            {/* Property Type Selection */}
            <Typography variant="h6" className="mt-6">
              What type of property are you looking to list?
            </Typography>
            <FormControl component="fieldset" className="mt-2">
              <RadioGroup
                row
                name="propertyType"
                value={propertyDetails.propertyType}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="residential"
                  control={<Radio />}
                  label="Residential"
                />
                <FormControlLabel
                  value="commercial"
                  control={<Radio />}
                  label="Commercial"
                />
                <FormControlLabel
                  value="rural"
                  control={<Radio />}
                  label="Rural"
                />
                <FormControlLabel
                  value="land"
                  control={<Radio />}
                  label="Land"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </div>

        {/* Info Alerts (Responsive) */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          <Alert severity="info">
            <strong>Please remember:</strong>
            <br />
            Realestate.com.au rules do not permit users to set the location of
            properties to a more popular nearby suburb/town.
            <br />
            Please use the legal address as shown on your council rates.
          </Alert>

          <Alert severity="info">
            <strong>Address Visibility:</strong> Not sure whether to show or
            hide your address? We recommend displaying it in most cases.
          </Alert>

          <Alert severity="info">
            <strong>Need help?</strong> Get in touch with our team!
            <br /> 📞 INSERT
            <br /> 📱 INSERT
          </Alert>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert severity="error" className="mx-6">
          {error}
        </Alert>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6 p-6">
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Back
        </Button>
        <Button variant="contained" onClick={handleContinue} disabled={loading}>
          {loading ? "Creating..." : "Continue"}
        </Button>
      </div>
    </Box>
  );
}
