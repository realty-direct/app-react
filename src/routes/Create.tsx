import {
  Alert,
  Box,
  Button,
  CircularProgress,
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
import { useNavigate } from "react-router";
import { updatePropertyDetailInDB } from "../database/details";
import { createPropertyInDB } from "../database/property";
import useRealtyStore from "../store/store";

export default function Create(): JSX.Element {
  const navigate = useNavigate();
  const { addProperty, profile, createPropertyDetail } = useRealtyStore();
  const [propertyDetails, setPropertyDetails] = useState<{
    address: string;
    propertyCategory: "residential" | "commercial" | "land" | "rural" | "";
  }>({
    address: "",
    propertyCategory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyDetails({ ...propertyDetails, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    if (!propertyDetails.address || !propertyDetails.propertyCategory) {
      setError("Please provide both an address and property category.");
      return;
    }

    if (!profile) {
      setError("User not found. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create the property in the database
      const newProperty = await createPropertyInDB({
        user_id: profile.id,
        address: propertyDetails.address,
        status: "draft",
      });

      if (!newProperty) throw new Error("Failed to create property.");

      // Step 2: Update Zustand with the fetched property
      addProperty(newProperty);

      // Step 3: Update property details in the database with property category
      // and pre-fill the contact details from the user's profile
      const fetchedPropertyDetail = await updatePropertyDetailInDB(
        newProperty.id,
        {
          property_category: propertyDetails.propertyCategory,
          contact_name: `${profile.first_name} ${profile.last_name}`.trim(),
          contact_email: profile.email,
          contact_phone: "", // We don't have phone in profile, so leaving it empty
        }
      );

      if (!fetchedPropertyDetail)
        throw new Error("Failed to update property details.");

      // Step 4: Create property detail in Zustand
      createPropertyDetail(newProperty.id, propertyDetails.propertyCategory);

      // Step 5: Navigate to the new property page
      navigate(`/property/${newProperty.id}`);
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred.");
      setLoading(false); // Make sure to reset loading state on error
    }
  };

  return (
    <Box className="w-full">
      {/* Sticky Tabs */}
      <div className="sticky top-0 z-50 shadow-md">
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

          <Box className="mt-4">
            {/* Address Input */}
            <Box className="mt-4 relative">
              <TextField
                fullWidth
                label="Full Address"
                name="address"
                value={propertyDetails.address}
                onChange={handleInputChange}
                variant="outlined"
                disabled={loading}
              />
            </Box>

            {/* Map Placeholder */}
            <div className="mt-6 h-72 bg-gray-200 flex items-center justify-center rounded-md">
              <Typography variant="body1">Map Placeholder</Typography>
            </div>

            {/* Property Category Selection */}
            <Typography variant="h6" className="mt-6">
              What category of property are you looking to list?
            </Typography>
            <FormControl component="fieldset" className="mt-2">
              <RadioGroup
                row
                name="propertyCategory"
                value={propertyDetails.propertyCategory}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="residential"
                  control={<Radio disabled={loading} />}
                  label="Residential"
                />
                <FormControlLabel
                  value="commercial"
                  control={<Radio disabled={loading} />}
                  label="Commercial"
                />
                <FormControlLabel
                  value="rural"
                  control={<Radio disabled={loading} />}
                  label="Rural"
                />
                <FormControlLabel
                  value="land"
                  control={<Radio disabled={loading} />}
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
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={loading}
          sx={{ minWidth: "120px" }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Creating...
            </Box>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </Box>
  );
}