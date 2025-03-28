import { Alert, Box, Button, Grid2, Tab, Tabs } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  fetchPropertyDetailInDb,
  updatePropertyDetailInDB,
} from "../../database/details";
import {
  fetchUserPropertiesFeaturesFromDB,
  updatePropertyFeatureInDB,
} from "../../database/features";
import useRealtyStore from "../../store/store";
import Contact from "./Contact";
import Description from "./Description";
import Details from "./Details";
import Features from "./Features";
import Inspections from "./Inspections";
import ListingEnhancements from "./ListingEnhancements";
import Media from "./Media/Media";
import Ownership from "./Ownership";
import Price from "./Price";
import Summary from "./Summary";

export default function Edit() {
  const { id: propertyId } = useParams();
  const {
    updatePropertyDetail,
    setPropertyFeatures,
    propertyDetails,
    propertyFeatures,
  } = useRealtyStore();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"save" | "navigate" | "">("");

  // Track if component is mounted and initialized
  const isInitialized = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use refs to track saved state to prevent recreation on re-renders
  const lastSavedDetailsRef = useRef<any>(null);
  const lastSavedFeaturesRef = useRef<any>(null);

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const propertyFeature = propertyFeatures.filter(
    (p) => p.property_id === propertyId
  );

  // Initialize last saved state only once
  useEffect(() => {
    if (propertyDetail && !lastSavedDetailsRef.current) {
      lastSavedDetailsRef.current = JSON.parse(JSON.stringify(propertyDetail));
    }

    if (propertyFeature.length > 0 && !lastSavedFeaturesRef.current) {
      lastSavedFeaturesRef.current = JSON.parse(
        JSON.stringify(propertyFeature)
      );
    }

    // Mark as initialized after the first render cycle
    if (propertyDetail && !isInitialized.current) {
      isInitialized.current = true;
    }
  }, [propertyDetail, propertyFeature]);

  // Track changes by comparing current state with last saved state
  useEffect(() => {
    // Only check for changes after initialization to prevent false positives
    if (
      isInitialized.current &&
      propertyDetail &&
      lastSavedDetailsRef.current
    ) {
      const detailsChanged =
        JSON.stringify(lastSavedDetailsRef.current) !==
        JSON.stringify(propertyDetail);
      const featuresChanged =
        JSON.stringify(lastSavedFeaturesRef.current) !==
        JSON.stringify(propertyFeature);

      setHasUnsavedChanges(detailsChanged || featuresChanged);
    }
  }, [propertyDetail, propertyFeature]);

  // Save Function - shared between tab change and continue button
  const saveChanges = async () => {
    if (!propertyDetail || !propertyId || !hasUnsavedChanges) return false;

    setLoading(true);
    setActionType("save");

    try {
      // First, update the DB with changes from Zustand
      await updatePropertyDetailInDB(propertyId, propertyDetail);

      if (propertyFeature.length > 0) {
        await updatePropertyFeatureInDB(propertyId, propertyFeature);
      }

      // Fetch the latest data from the DB
      const updatedPropertyDetails = await fetchPropertyDetailInDb(propertyId);
      const updatedPropertyFeatures = await fetchUserPropertiesFeaturesFromDB([
        propertyId,
      ]);

      // Sync Zustand store with updated DB data
      if (updatedPropertyDetails) {
        updatePropertyDetail(propertyId, updatedPropertyDetails);
        lastSavedDetailsRef.current = JSON.parse(
          JSON.stringify(updatedPropertyDetails)
        );
      }

      if (updatedPropertyFeatures.length > 0) {
        setPropertyFeatures(updatedPropertyFeatures);
        lastSavedFeaturesRef.current = JSON.parse(
          JSON.stringify(updatedPropertyFeatures)
        );
      }

      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Error saving property data:", error);
      return false;
    } finally {
      setLoading(false);
      setActionType("");
    }
  };

  // On tab change, save if there are changes
  const handleTabChange = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    if (!propertyId || loading || !isInitialized.current) return;

    // If there are unsaved changes, save before changing tabs
    if (hasUnsavedChanges) {
      const success = await saveChanges();

      // Only change tab if save was successful
      if (success) {
        setTabValue(newValue);
      }
    } else {
      // If no changes, just change the tab
      setTabValue(newValue);
    }
  };

  // On continue button click
  const handleContinue = async () => {
    if (loading || !isInitialized.current) return;

    if (hasUnsavedChanges) {
      const success = await saveChanges();

      if (success) {
        // Navigate to next tab after successful save
        setTabValue((prev) => prev + 1);
      }
    } else {
      // If no changes to save, just navigate
      setTabValue((prev) => prev + 1);
    }
  };

  const handleBack = async () => {
    if (loading || !isInitialized.current) return;

    if (hasUnsavedChanges) {
      const success = await saveChanges();
      if (success) {
        setTabValue((prev) => prev - 1);
      }
    } else {
      setTabValue((prev) => prev - 1);
    }
  };

  return (
    <Grid2 container sx={{ position: "relative" }}>
      {/* Sticky Tabs */}
      <Grid2
        size={12}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: (theme) => `0 2px 4px ${theme.palette.divider}`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Property editing tabs"
          variant="scrollable"
          scrollButtons
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tab label="Details" disabled={loading} />
          <Tab label="Features" disabled={loading} />
          <Tab label="Price" disabled={loading} />
          <Tab label="Photos and Media" disabled={loading} />
          <Tab label="Ownership" disabled={loading} />
          <Tab label="Description" disabled={loading} />
          <Tab label="Contact" disabled={loading} />
          <Tab label="Inspections" disabled={loading} />
          <Tab label="Listing Enhancements" disabled={loading} />
          <Tab label="Summary" disabled={loading} />
        </Tabs>
      </Grid2>

      {/* Tab Content */}
      <Grid2 size={9} p={3}>
        {tabValue === 0 && <Details />}
        {tabValue === 1 && <Features />}
        {tabValue === 2 && <Price />}
        {tabValue === 3 && <Media />}
        {tabValue === 4 && <Ownership />}
        {tabValue === 5 && <Description />}
        {tabValue === 6 && <Contact />}
        {tabValue === 7 && <Inspections />}
        {tabValue === 8 && <ListingEnhancements />}
        {tabValue === 9 && <Summary />}

        {/* Just the standard note - removed alerts about unsaved changes */}
        <Alert severity="info" role="alert" icon={undefined} sx={{ mt: 2 }}>
          Please note: You can skip this section at any time
        </Alert>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            variant="outlined"
            sx={{ maxWidth: "150px" }}
            onClick={handleBack}
            size="large"
            disabled={loading || tabValue === 0}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ maxWidth: "150px", minWidth: "120px" }}
            size="large"
            onClick={handleContinue}
            disabled={loading || tabValue === 9}
            data-feature-save
          >
            {loading && actionType === "save" ? (
              <LoadingSpinner buttonMode text="Saving..." size={24} />
            ) : (
              "Continue"
            )}
          </Button>
        </Box>
      </Grid2>

      {/* Sidebar */}
      <Grid2 size={3} p={3}>
        Insert side info here
      </Grid2>

      {/* No full-screen loading overlay */}
    </Grid2>
  );
}
