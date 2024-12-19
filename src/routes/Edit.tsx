import { Box, Tab, Tabs } from "@mui/material";
import { type JSX, useState } from "react";
import DetailsTab from "./Edit/Details";

export default function Edit(): JSX.Element {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexGrow: 1,

        minHeight: "100%",
      }}
    >
      {/* Vertical Tabs */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRight: 1,
          borderColor: "divider",
          minWidth: 200, // Ensures tabs have a consistent width
        }}
      >
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Vertical tabs example"
          sx={{ flexGrow: 1 }}
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
      </Box>

      {/* Tab Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {tabValue === 0 && <DetailsTab />}
        {tabValue === 1 && <Box>Features Content</Box>}
        {tabValue === 2 && <Box>Price Content</Box>}
        {tabValue === 3 && <Box>Photos and Media Content</Box>}
        {tabValue === 4 && <Box>Ownership Content</Box>}
        {tabValue === 5 && <Box>Description Content</Box>}
        {tabValue === 6 && <Box>Contact Content</Box>}
        {tabValue === 7 && <Box>Inspections Content</Box>}
        {tabValue === 8 && <Box>Listing Enhancements Content</Box>}
        {tabValue === 9 && <Box>Checkout Content</Box>}
      </Box>
    </Box>
  );
}
