import { Box, Tabs } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import DetailsTab from "./Edit/Details";

export default function Edit() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      {/* Vertical Tabs */}
      <Box
        sx={{
          flexDirection: "column",
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <Tabs
          orientation="vertical"
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Vertical tabs example"
          sx={{ flex: 1, minHeight: "100%" }}
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
      <Box sx={{ p: 3, minHeight: "100%", flexGrow: 1 }}>
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
