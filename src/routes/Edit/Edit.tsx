import { Alert, Box, Button, Grid2, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router"; // ✅ Added useParams
import {
  fetchPropertyDetailInDb,
  updatePropertyDetailInDB,
} from "../../database/details";
import {
  fetchUserPropertyFeaturesFromDB,
  updatePropertyFeatureInDB,
} from "../../database/features";
import useRealtyStore from "../../store/store"; // ✅ Import Zustand store
import Contact from "./Contact";
import Description from "./Description";
import Details from "./Details";
import Features from "./Features";
import Inspections from "./Inspections";
import ListingEnhancements from "./ListingEnhancements";
import Media from "./Media";
import Ownership from "./Ownership";
import Price from "./Price";
import Summary from "./Summary";

export default function Edit() {
  const { id: propertyId } = useParams(); // ✅ Get the property ID
  const {
    updatePropertyDetail,
    setPropertyFeatures,
    propertyDetails,
    propertyFeatures,
  } = useRealtyStore(); // ✅ Zustand function
  const [tabValue, setTabValue] = useState(0);

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const propertyFeature = propertyFeatures.filter(
    (p) => p.property_id === propertyId
  );

  // TODO: Inspections save logic needs to be added here.

  // NOTE: On tab change we update the DB. This only runs on tab change.
  const handleTabChange = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    if (tabValue === 1 && propertyId) {
      await savePropertyFeatures(propertyId);
    }
    setTabValue(newValue);
  };

  // NOTE: On continue we update the DB.
  const handleContinue = async () => {
    if (!propertyDetail || !propertyId) return;

    // First we update the DB with our changes from store

    await updatePropertyDetailInDB(propertyId, propertyDetail);

    if (propertyFeature) {
      await updatePropertyFeatureInDB(propertyId, propertyFeature);
    }

    // We then fetch these changes

    const propertyDetails = await fetchPropertyDetailInDb(propertyId);

    const propertyFeatures = await fetchUserPropertyFeaturesFromDB(propertyId);

    // We then sync the store with the DB

    if (propertyDetails) {
      updatePropertyDetail(propertyId, propertyDetails);
    }

    if (propertyFeatures) {
      setPropertyFeatures(propertyId, propertyFeatures);
    }

    if (propertyFeatures) await savePropertyFeatures(propertyId); // ✅ Save features

    setTabValue((prev) => prev + 1);
  };

  const handleBack = () => {
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
          aria-label="Horizontal tabs example"
          variant="scrollable"
          scrollButtons
          sx={{
            borderBottom: 1,
            borderColor: "divider",
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
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ maxWidth: "150px" }}
            size="large"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Grid2>

      {/* Navigation Buttons */}
      <Grid2 size={3} p={3}>
        Insert side info here
        {
          // Something like a SideEditChooser where it will display whatever is needed in the sidebar like a video
        }
      </Grid2>
    </Grid2>
  );
}
