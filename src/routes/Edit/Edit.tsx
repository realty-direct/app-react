import { Alert, Box, Button, Grid2, Tab, Tabs } from "@mui/material";
import type React from "react";
import { useState } from "react";
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
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContinue = () => {
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
          top: 0, // Stick to top when scrolling
          zIndex: 1200, // Ensure tabs stay above content
          backgroundColor: "background.paper", // Use theme background color
          borderBottom: 1,
          borderColor: "divider",
          // Add subtle shadow when sticky
          boxShadow: (theme) => `0 2px 4px ${theme.palette.divider}`,
          // Smooth transition for shadow
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
          Please note: You can skip this section at anytime
        </Alert>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2, // Adds spacing between buttons
            mt: 2, // Adds margin top
          }}
        >
          <Button
            variant="outlined"
            sx={{ maxWidth: "150px" }}
            onClick={handleBack}
            // size="large"
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
