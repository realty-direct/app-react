import { Alert, Box, Button, Tab, Tabs } from "@mui/material";
import type React from "react";
import { useState } from "react";
import Details from "./Edit/Details";
import Features from "./Edit/Features";

export default function Edit() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100vw", // Ensure the layout spans the entire width
        padding: 1,
      }}
    >
      {/* Horizontal Tabs */}
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
        <Tab label="Checkout" />
      </Tabs>

      {/* Tab Content */}
      <Box
        sx={{
          flexGrow: 1, // Tab content grows to fill remaining height
          // overflowY: "auto", // Enables scrolling for content
          p: 3, // Adds padding
          width: "100%", // Content takes full width
        }}
      >
        {tabValue === 0 && <Details />}
        {tabValue === 1 && <Features />}
        {tabValue === 2 && <Box>Price Content</Box>}
        {tabValue === 3 && <Box>Photos and Media Content</Box>}
        {tabValue === 4 && <Box>Ownership Content</Box>}
        {tabValue === 5 && <Box>Description Content</Box>}
        {tabValue === 6 && <Box>Contact Content</Box>}
        {tabValue === 7 && <Box>Inspections Content</Box>}
        {tabValue === 8 && <Box>Listing Enhancements Content</Box>}
        {tabValue === 9 && <Box>Checkout Content</Box>}
      </Box>
      {/* Navigation Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 6,
          flexWrap: "wrap", // Ensures buttons wrap on small screens
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            flex: "1 1 auto",
            maxWidth: "150px",
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            flex: "1 1 auto",
            maxWidth: "150px",
          }}
        >
          Continue
        </Button>
        <Alert severity="info" role="alert">
          Please note: You can skip this section at anytime
        </Alert>
      </Box>
    </Box>
  );
}
