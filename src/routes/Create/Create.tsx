import { Box, Button, Tab, Tabs } from "@mui/material";

import type { JSX } from "react";
import { useState } from "react";
import AdditionalInfo from "./AdditionalInfo";
import PropertyDetails from "./PropertyDetails";

export default function Create(): JSX.Element {
  const [tabIndex, setTabIndex] = useState(0);
  const [propertyDetails, setPropertyDetails] = useState({ address: "" });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const handlePropertyDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPropertyDetails({ address: e.target.value });
  };

  const handleContinue = () => {
    if (tabIndex === 0) {
      setTabIndex(1);
      return;
    } else {
      // insert continue logic here
    }
    console.log("Property Details Submitted: ", propertyDetails);
  };

  const handleBack = () => {
    setTabIndex(0);
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {/* Tabs for Navigation */}
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Property Details" />
        <Tab label="Additional Info" />
      </Tabs>

      {tabIndex === 0 ? (
        <>
          <PropertyDetails
            handlePropertyDetailsChange={handlePropertyDetailsChange}
            propertyDetails={propertyDetails}
          />
          <Button variant={"contained"} onClick={handleContinue}>
            Next
          </Button>
        </>
      ) : (
        <>
          <AdditionalInfo />
          <Button color={"inherit"} variant={"contained"} onClick={handleBack}>
            Back
          </Button>
          <Button variant={"contained"} onClick={handleContinue}>
            Continue
          </Button>
        </>
      )}
    </Box>
  );
}
