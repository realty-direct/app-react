// File: src/routes/Edit/Edit.tsx - Updated with sidebar for Summary tab
import { Alert, Box, Button, Grid2, Tab, Tabs } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderSummary from "../../components/OrderSummary";
import {
  fetchPropertyDetailInDb,
  updatePropertyDetailInDB,
} from "../../database/details";
import {
  addPropertyEnhancement,
  fetchPropertyEnhancements,
} from "../../database/enhancements";
import {
  fetchUserPropertiesFeaturesFromDB,
  updatePropertyFeatureInDB,
} from "../../database/features";
import {
  createMultipleInspections,
  fetchPropertyInspections,
  updatePropertyInspection,
} from "../../database/inspections";
import useRealtyStore from "../../store/store";
import Contact from "./Contact";
import Description from "./Description";
import Details from "./Details";
import Features from "./Features";
import Inspections from "./Inspections";
import ListingEnhancements from "./ListingEnhancements";
import Media from "./Media/Media";
import Ownership from "./Ownership";
import Packages from "./Packages";
import Price from "./Price";
import Summary from "./Summary";

export default function Edit() {
  const { id: propertyId } = useParams();
  const {
    updatePropertyDetail,
    setPropertyFeatures,
    propertyDetails,
    propertyFeatures,
    propertyInspections,
    setPropertyInspections,
    propertyEnhancements,
    setPropertyEnhancements,
    getEnhancementsForProperty,
  } = useRealtyStore();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"save" | "navigate" | "">("");
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Track if component is mounted and initialized
  const isInitialized = useRef(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use refs to track saved state to prevent recreation on re-renders
  const lastSavedDetailsRef = useRef<typeof propertyDetail>(null);
  const lastSavedFeaturesRef = useRef<typeof propertyFeature>(null);
  const lastSavedInspectionsRef = useRef<typeof propertyInspections>([]);
  const lastSavedEnhancementsRef = useRef<typeof propertyEnhancements>([]);

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const propertyFeature = propertyFeatures.filter(
    (p) => p.property_id === propertyId
  );

  const currentInspections = propertyInspections.filter(
    (insp) => insp.property_id === propertyId
  );

  const currentEnhancements = getEnhancementsForProperty(propertyId || "");

  // Calculate package price for the order summary
  const packagePricing: Record<string, number> = {
    ESSENTIAL: 599,
    ADVANTAGE: 1299,
    PREMIUM: 1999,
  };

  const packagePrice =
    propertyDetail?.property_package &&
    propertyDetail.property_package in packagePricing
      ? packagePricing[propertyDetail.property_package]
      : 0;

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

    if (currentInspections.length > 0 && !lastSavedInspectionsRef.current) {
      lastSavedInspectionsRef.current = JSON.parse(
        JSON.stringify(currentInspections)
      );
    }

    if (currentEnhancements.length > 0 && !lastSavedEnhancementsRef.current) {
      lastSavedEnhancementsRef.current = JSON.parse(
        JSON.stringify(currentEnhancements)
      );
    }

    // Mark as initialized after the first render cycle
    if (propertyDetail && !isInitialized.current) {
      isInitialized.current = true;
    }
  }, [
    propertyDetail,
    propertyFeature,
    currentInspections,
    currentEnhancements,
  ]);

  // Track changes by comparing current state with last saved state
  useEffect(() => {
    // Only check for changes after initialization to prevent false positives
    if (
      isInitialized.current &&
      propertyDetail &&
      lastSavedDetailsRef.current
    ) {
      // For deep comparison, we need to handle arrays/objects carefully
      const detailsChanged =
        JSON.stringify(sortObjectKeys(lastSavedDetailsRef.current)) !==
        JSON.stringify(sortObjectKeys(propertyDetail));

      const featuresChanged =
        JSON.stringify(sortObjectKeys(lastSavedFeaturesRef.current || [])) !==
        JSON.stringify(sortObjectKeys(propertyFeature || []));

      const inspectionsChanged =
        JSON.stringify(
          sortObjectKeys(lastSavedInspectionsRef.current || [])
        ) !== JSON.stringify(sortObjectKeys(currentInspections || []));

      const enhancementsChanged =
        JSON.stringify(
          sortObjectKeys(lastSavedEnhancementsRef.current || [])
        ) !== JSON.stringify(sortObjectKeys(currentEnhancements || []));

      const hasChanges =
        detailsChanged ||
        featuresChanged ||
        inspectionsChanged ||
        enhancementsChanged;

      if (hasChanges !== hasUnsavedChanges) {
        console.log(
          hasChanges
            ? "Changes detected in property data"
            : "No changes in property data"
        );
        setHasUnsavedChanges(hasChanges);
      }
    }
  }, [
    propertyDetail,
    propertyFeature,
    currentInspections,
    currentEnhancements,
    hasUnsavedChanges,
    propertyId,
  ]);

  // Helper function to sort object keys for consistent comparison
  const sortObjectKeys = (obj: any) => {
    if (!obj) return obj;

    // If it's an array, sort each object in the array
    if (Array.isArray(obj)) {
      return [...obj].map(sortObjectKeys);
    }

    // If it's an object, sort its keys
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj)
        .sort()
        .reduce(
          (result, key) => {
            result[key] = sortObjectKeys(obj[key]);
            return result;
          },
          {} as Record<string, any>
        );
    }

    // Otherwise return the value as is
    return obj;
  };

  // Save Function - shared between tab change and continue button
  // In Edit.tsx, update the saveChanges function:

  const saveChanges = async () => {
    if (!propertyDetail || !propertyId) return false;

    // Double check if there are actually changes before saving
    if (!hasUnsavedChanges) {
      return true;
    }

    setLoading(true);
    setActionType("save");

    try {
      // First, update the DB with changes from Zustand
      await updatePropertyDetailInDB(propertyId, propertyDetail);

      // Handle property features
      if (propertyFeature.length > 0) {
        await updatePropertyFeatureInDB(propertyId, propertyFeature);
      }

      // Handle inspections
      if (currentInspections.length > 0) {
        // Split inspections into existing and new
        const existingInspections = currentInspections.filter(
          (insp) => insp.id && !insp.id.toString().startsWith("temp-")
        );

        const newInspections = currentInspections
          .filter((insp) => !insp.id || insp.id.toString().startsWith("temp-"))
          .map(({ id, ...rest }) => rest); // Remove temporary IDs

        // Update existing inspections
        if (existingInspections.length > 0) {
          console.log(
            `Updating ${existingInspections.length} existing inspections`
          );
          for (const insp of existingInspections) {
            if (insp.id) {
              await updatePropertyInspection(insp.id, {
                inspection_date: insp.inspection_date,
                start_time: insp.start_time,
                end_time: insp.end_time,
                inspection_type: insp.inspection_type,
              });
            }
          }
        }

        // Create new inspections
        if (newInspections.length > 0) {
          const createdInspections =
            await createMultipleInspections(newInspections);
          console.log(
            `Successfully created ${createdInspections.length} inspections`
          );
        }
      }

      // Handle enhancements - FIX HERE
      const enhancementsChanged =
        JSON.stringify(
          sortObjectKeys(lastSavedEnhancementsRef.current || [])
        ) !== JSON.stringify(sortObjectKeys(currentEnhancements));

      if (enhancementsChanged && currentEnhancements.length > 0) {
        console.log(
          `Debug: Need to process ${currentEnhancements.length} enhancements`
        );

        // Track enhancement types already processed to avoid duplicates
        const processedEnhancementTypes = new Set();

        // Only save new enhancements without server IDs (temporary ones)
        const newEnhancements = currentEnhancements.filter(
          (enhancement) =>
            !enhancement.id || enhancement.id.toString().startsWith("temp-")
        );

        console.log(
          `Debug: Found ${newEnhancements.length} new enhancements to save`
        );

        for (const enhancement of newEnhancements) {
          // Skip if we've already processed this enhancement type for this property
          const enhancementKey = `${enhancement.property_id}:${enhancement.enhancement_type}`;
          if (processedEnhancementTypes.has(enhancementKey)) {
            console.log(
              `Debug: Skipping duplicate enhancement type: ${enhancement.enhancement_type}`
            );
            continue;
          }

          // Mark this enhancement type as processed
          processedEnhancementTypes.add(enhancementKey);

          console.log(
            `Debug: Processing enhancement: ${enhancement.enhancement_type}`
          );

          try {
            const { id, ...enhancementData } = enhancement;
            const result = await addPropertyEnhancement(enhancementData);
            console.log(`Debug: Enhancement save result:`, result);
          } catch (err) {
            console.error(`Debug: Error saving enhancement:`, err);
          }
        }
      }

      // Fetch the latest data from the DB
      const updatedPropertyDetails = await fetchPropertyDetailInDb(propertyId);
      const updatedPropertyFeatures = await fetchUserPropertiesFeaturesFromDB([
        propertyId,
      ]);
      const updatedInspections = await fetchPropertyInspections(propertyId);
      const updatedEnhancements = await fetchPropertyEnhancements(propertyId);

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

      // Update inspections in store
      if (updatedInspections.length > 0) {
        // Keep inspections from other properties
        const otherInspections = propertyInspections.filter(
          (insp) => insp.property_id !== propertyId
        );

        // Set all inspections
        setPropertyInspections([...otherInspections, ...updatedInspections]);
        lastSavedInspectionsRef.current = JSON.parse(
          JSON.stringify(updatedInspections)
        );
      }

      // Update enhancements in store - maintain uniqueness by using a Set approach
      if (updatedEnhancements.length > 0) {
        // Keep enhancements for other properties
        const otherEnhancements = propertyEnhancements.filter(
          (enh) => enh.property_id !== propertyId
        );

        // Create a uniqueness map for updated enhancements
        const uniqueEnhancements = [];
        const enhancementTypeMap = new Map();

        for (const enhancement of updatedEnhancements) {
          const key = `${enhancement.property_id}:${enhancement.enhancement_type}`;
          if (!enhancementTypeMap.has(key)) {
            enhancementTypeMap.set(key, enhancement);
            uniqueEnhancements.push(enhancement);
          }
        }

        // Set enhancements in store
        setPropertyEnhancements([...otherEnhancements, ...uniqueEnhancements]);
        lastSavedEnhancementsRef.current = JSON.parse(
          JSON.stringify(uniqueEnhancements)
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

  // Finalize listing function to be passed to OrderSummary component
  const handleFinalizeListing = async () => {
    if (!propertyId || !propertyDetail) return;

    setIsFinalizing(true);

    try {
      // In a real app, you would make API calls to:
      // 1. Process payment
      // 2. Schedule publishing if needed
      // 3. Update property status from "draft" to "pending" or "active"

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Get the current publish option from the store
      const currentPublishOption =
        propertyDetail?.publish_option || "immediately";

      // Update property status in store
      updatePropertyDetail(propertyId, {
        listing_status:
          currentPublishOption === "immediately" ? "active" : "scheduled",
        payment_status: "completed",
        payment_date: new Date().toISOString().split("T")[0],
      });

      // Navigate to success page or property dashboard
      window.location.href = `/property/${propertyId}`;
    } catch (error) {
      console.error("Error finalizing listing:", error);
      // Show error message to user
    } finally {
      setIsFinalizing(false);
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
      return;
    }

    // If no changes, just change the tab without saving
    setTabValue(newValue);
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
      return;
    }

    // If no changes to save, just navigate
    setTabValue((prev) => prev + 1);
  };

  const handleBack = async () => {
    if (loading || !isInitialized.current) return;

    if (hasUnsavedChanges) {
      const success = await saveChanges();
      if (success) {
        setTabValue((prev) => prev - 1);
      }
      return;
    }

    setTabValue((prev) => prev - 1);
  };

  // Determine if we should show the sidebar with the order summary
  const showOrderSummary = tabValue === 10 && propertyDetail;

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
          <Tab label="Packages" disabled={loading} />
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
        {tabValue === 8 && <Packages />}
        {tabValue === 9 && <ListingEnhancements />}
        {tabValue === 10 && <Summary />}

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
            disabled={loading || tabValue === 10}
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

      {/* Order Summary Sidebar - Only shown on Summary tab */}
      {showOrderSummary ? (
        <Grid2 size={3} p={3}>
          <OrderSummary
            propertyId={propertyId || ""}
            packageType={propertyDetail.property_package}
            packagePrice={packagePrice}
            enhancements={currentEnhancements}
            phoneConfirmed={propertyDetail.phone_confirmed || false}
            publishOption={propertyDetail.publish_option || "immediately"}
            publishDate={
              propertyDetail.publish_date
                ? new Date(propertyDetail.publish_date)
                : null
            }
            handleFinalizeListing={handleFinalizeListing}
          />
        </Grid2>
      ) : (
        <Grid2 size={3} p={3}>
          Insert side info here
        </Grid2>
      )}

      {/* No full-screen loading overlay */}
    </Grid2>
  );
}
