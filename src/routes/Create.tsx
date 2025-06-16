import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import BasicAddressSearch from "../components/BasicAddressSearch";
import GoogleMap from "../components/GoogleMap";
import GoogleMapsProvider from "../components/GoogleMapsProvider";
import PropertyCategorySelector from "../components/PropertyCategorySelector";
import { updatePropertyDetailInDB } from "../database/details";
import { createPropertyInDB } from "../database/property";
import useRealtyStore from "../store/store";

export default function Create() {
  const navigate = useNavigate();
  const { addProperty, profile, createPropertyDetail } = useRealtyStore();
  const [propertyDetails, setPropertyDetails] = useState<{
    address: string;
    propertyCategory: "residential" | "commercial" | "land" | "rural" | "";
    location?: { lat: number; lng: number };
  }>({
    address: "",
    propertyCategory: "",
  });
  
  // No need for loading state, handled by GoogleMapsProvider
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasValidAddress, setHasValidAddress] = useState(false);


  // Handle address change (typing or selection without coordinates)
  const handleAddressChange = (address: string) => {
    setPropertyDetails({ ...propertyDetails, address });
    // Reset valid address flag when user is typing
    if (propertyDetails.address !== address) {
      setHasValidAddress(false);
    }
  };

  // Handle complete address selection with coordinates
  const handleAddressSelected = (address: string, location: { lat: number; lng: number }) => {
    setPropertyDetails({ ...propertyDetails, address, location });
    setHasValidAddress(true);
  };

  const handleContinue = async () => {
    if (!hasValidAddress) {
      setError("Please select a valid address from the dropdown suggestions.");
      return;
    }
    
    if (!propertyDetails.propertyCategory) {
      setError("Please select a property category.");
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
          // Don't store location in the description field
          description: "",
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
    <GoogleMapsProvider>
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
            {/* Address Input with Autocomplete */}
            <Box className="mt-4 relative">
              <BasicAddressSearch
                address={propertyDetails.address}
                onAddressChange={handleAddressChange}
                onAddressSelected={handleAddressSelected}
                disabled={loading}
              />
            </Box>

            {/* Google Map */}
            <Box className="mt-6 h-72 rounded-md overflow-hidden">
              <GoogleMap 
                location={propertyDetails.location}
                height={290}
                zoom={propertyDetails.location ? 16 : 4} // Zoom in when location is selected
              />
            </Box>

            {/* Property Category Selection */}
            <Box className="mt-6">
              <Typography variant="h6" className="mb-4" fontWeight="500">
                What category of property are you looking to list?
              </Typography>
              
              <PropertyCategorySelector
                value={propertyDetails.propertyCategory}
                onChange={(category) => setPropertyDetails({...propertyDetails, propertyCategory: category})}
                disabled={loading}
              />
            </Box>
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
      <Box className="mt-6 p-6" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={loading || !hasValidAddress || !propertyDetails.propertyCategory}
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
      </Box>
      </Box>
    </GoogleMapsProvider>
  );
}