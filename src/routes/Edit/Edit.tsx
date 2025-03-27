import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid2,
  Tab,
  Tabs,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router";
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

  // Add loading states
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"save" | "navigate" | "">("");

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const propertyFeature = propertyFeatures.filter(
    (p) => p.property_id === propertyId
  );

  // On tab change we update the DB if necessary
  const handleTabChange = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    if (!propertyId || loading) return; // Prevent tab change while loading

    // Only save if changing from Features tab since it has special save logic
    if (tabValue === 1 && propertyFeature.length > 0) {
      setLoading(true);
      setActionType("navigate");

      try {
        await updatePropertyFeatureInDB(propertyId, propertyFeature);
        // Change tab after successful save
        setTabValue(newValue);
      } catch (error) {
        console.error("Error saving features:", error);
      } finally {
        setLoading(false);
        setActionType("");
      }
    } else {
      // If not coming from Features tab, change immediately
      setTabValue(newValue);
    }
  };

  // On continue we update the DB
  const handleContinue = async () => {
    if (!propertyDetail || !propertyId) return;

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
      }

      if (updatedPropertyFeatures.length > 0) {
        setPropertyFeatures(updatedPropertyFeatures);
      }

      // Navigate to next tab
      setTabValue((prev) => prev + 1);
    } catch (error) {
      console.error("Error saving property data:", error);
    } finally {
      setLoading(false);
      setActionType("");
    }
  };

  const handleBack = () => {
    if (loading) return; // Prevent navigation while loading
    setTabValue((prev) => prev - 1);
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
            "& .MuiTab-root": {
              opacity: loading ? 0.5 : 1,
              pointerEvents: loading ? "none" : "auto",
            },
          }}
        >
          <Tab label="Details" />
          <Tab label="Features" />
          <Tab label="Price" />
          <Tab label="Photos and Media" />
          <Tab label="Ownership" />
          <Tab label="Description" />
          <Tab label="Contact" />
          <Tab label="Inspections" />
          <Tab label="Listing Enhancements" />
          <Tab label="Summary" />
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
        <Alert severity="info" role="alert" icon={undefined}>
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
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                Saving...
              </Box>
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
    </Grid2>
  );
}
