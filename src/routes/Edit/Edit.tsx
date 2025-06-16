import { Alert, Box, Button, Grid, Snackbar, Tab, Tabs } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import EnhancementsSummary from "../../components/EnhancementSummary";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderSummary from "../../components/OrderSummary";
import SectionHelp from "../../components/SectionHelp";
import { updatePropertyDetailInDB } from "../../database/details";
import {
  addPropertyEnhancement,
  removePropertyEnhancement,
} from "../../database/enhancements";
import { updatePropertyFeatureInDB } from "../../database/features";
import {
  createMultipleInspections,
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
    propertyDetails,
    propertyFeatures,
    propertyInspections,
    getEnhancementsForProperty,
  } = useRealtyStore();

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [actionType, setActionType] = useState<"save" | "navigate" | "">("");

  const [snapshots, setSnapshots] = useState({
    propertyDetailSnapshot: "",
    featuresSnapshot: "",
    inspectionsSnapshot: "",
    enhancementsSnapshot: "",
    lastSavedAt: 0,
  });

  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

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

  const takeSnapshots = useCallback(() => {
    setSnapshots({
      propertyDetailSnapshot: JSON.stringify(propertyDetail || {}),
      featuresSnapshot: JSON.stringify(propertyFeature || []),
      inspectionsSnapshot: JSON.stringify(currentInspections || []),
      enhancementsSnapshot: JSON.stringify(currentEnhancements || []),
      lastSavedAt: Date.now(),
    });
  }, [
    propertyDetail,
    propertyFeature,
    currentInspections,
    currentEnhancements,
  ]);

  useEffect(() => {
    if (propertyDetail && propertyId && !snapshots.lastSavedAt) {
      takeSnapshots();
    }
  }, [propertyDetail, propertyId, snapshots.lastSavedAt, takeSnapshots]);

  const hasUnsavedChanges = useCallback(() => {
    if (!propertyDetail) return false;

    const currentDetailSnapshot = JSON.stringify(propertyDetail || {});
    const currentFeaturesSnapshot = JSON.stringify(propertyFeature || []);
    const currentInspectionsSnapshot = JSON.stringify(currentInspections || []);
    const currentEnhancementsSnapshot = JSON.stringify(
      currentEnhancements || []
    );

    return (
      currentDetailSnapshot !== snapshots.propertyDetailSnapshot ||
      currentFeaturesSnapshot !== snapshots.featuresSnapshot ||
      currentInspectionsSnapshot !== snapshots.inspectionsSnapshot ||
      currentEnhancementsSnapshot !== snapshots.enhancementsSnapshot
    );
  }, [
    propertyDetail,
    propertyFeature,
    currentInspections,
    currentEnhancements,
    snapshots,
  ]);

  const showNotification = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setSnackbarState({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const saveChanges = async () => {
    if (!propertyDetail || !propertyId) return false;

    if (!hasUnsavedChanges()) {
      return true;
    }

    setLoading(true);
    setActionType("save");

    try {
      const currentDetailSnapshot = JSON.stringify(propertyDetail || {});
      const currentFeaturesSnapshot = JSON.stringify(propertyFeature || []);
      const currentInspectionsSnapshot = JSON.stringify(
        currentInspections || []
      );
      const currentEnhancementsSnapshot = JSON.stringify(
        currentEnhancements || []
      );

      const shouldSaveDetails =
        currentDetailSnapshot !== snapshots.propertyDetailSnapshot;
      const shouldSaveFeatures =
        currentFeaturesSnapshot !== snapshots.featuresSnapshot;
      const shouldSaveInspections =
        currentInspectionsSnapshot !== snapshots.inspectionsSnapshot;
      const shouldSaveEnhancements =
        currentEnhancementsSnapshot !== snapshots.enhancementsSnapshot;

      if (shouldSaveDetails) {
        await updatePropertyDetailInDB(propertyId, propertyDetail);
      }

      if (shouldSaveFeatures && propertyFeature.length > 0) {
        await updatePropertyFeatureInDB(propertyId, propertyFeature);
      }

      if (shouldSaveInspections && currentInspections.length > 0) {
        const existingInspections = currentInspections.filter(
          (insp) => insp.id && !insp.id.toString().startsWith("temp-")
        );

        const newInspections = currentInspections
          .filter((insp) => !insp.id || insp.id.toString().startsWith("temp-"))
          .map(({ id, ...rest }) => rest);

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

        if (newInspections.length > 0) {
          await createMultipleInspections(newInspections);
        }
      }

      if (shouldSaveEnhancements) {
        const previousEnhancements = JSON.parse(
          snapshots.enhancementsSnapshot || "[]"
        );

        const removedEnhancements = previousEnhancements.filter(
          (prev: any) =>
            prev.id &&
            !prev.id.toString().startsWith("temp-") &&
            !currentEnhancements.some((curr) => curr.id === prev.id)
        );

        for (const enhancement of removedEnhancements) {
          try {
            if (enhancement.id) {
              await removePropertyEnhancement(enhancement.id);
            }
          } catch (err) {
            console.error("Error removing enhancement:", err);
          }
        }

        const newEnhancements = currentEnhancements.filter(
          (enhancement) =>
            !enhancement.id || enhancement.id.toString().startsWith("temp-")
        );

        const processedEnhancementTypes = new Set<string>();

        for (const enhancement of newEnhancements) {
          const enhancementKey = `${enhancement.property_id}:${enhancement.enhancement_type}`;
          if (processedEnhancementTypes.has(enhancementKey)) {
            continue;
          }

          processedEnhancementTypes.add(enhancementKey);

          try {
            const { id, ...enhancementData } = enhancement;
            await addPropertyEnhancement(enhancementData);
          } catch (err) {
            console.error("Error saving enhancement:", err);
          }
        }
      }

      takeSnapshots();

      showNotification("Changes saved successfully", "success");

      return true;
    } catch (error: any) {
      console.error("Error saving property data:", error);

      showNotification(
        `Error saving: ${error.message || "Unknown error"}`,
        "error"
      );

      return false;
    } finally {
      setLoading(false);
      setActionType("");
    }
  };

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



  const handleTabChange = async (
    _event: React.SyntheticEvent,
    newValue: number
  ) => {
    if (!propertyId || loading) return;

    if (hasUnsavedChanges()) {
      const success = await saveChanges();

      if (success) {
        setTabValue(newValue);
      }
      return;
    }

    setTabValue(newValue);
  };

  const handleContinue = async () => {
    if (loading) return;

    if (hasUnsavedChanges()) {
      const success = await saveChanges();

      if (success) {
        setTabValue((prev) => prev + 1);
      }
      return;
    }

    setTabValue((prev) => prev + 1);
  };

  const handleBack = async () => {
    if (loading) return;

    if (hasUnsavedChanges()) {
      const success = await saveChanges();
      if (success) {
        setTabValue((prev) => prev - 1);
      }
      return;
    }

    setTabValue((prev) => prev - 1);
  };

  const showOrderSummary = tabValue === 10 && propertyDetail;

  return (
    <Grid
      container
      sx={{
        position: "relative",
        maxWidth: "100vw",
        minHeight: "100%",
        paddingBottom: "30px",
      }}
      size={12}
    >
      {/* Sticky Tabs */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          boxShadow: (theme) => `0 2px 4px ${theme.palette.divider}`,
          transition: "box-shadow 0.3s ease",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Property editing tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            maxWidth: "100%",
            minHeight: "48px",
            flex: 1,
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
      </Box>

      {/* Tab Content */}
      <Grid size={{ xs: 12, md: 9, lg: 9 }} p={3} sx={{ maxWidth: "100%" }}>
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
      </Grid>

      {/* Right Sidebar Content */}
      <Grid
        size={{ xs: 12, md: 3, lg: 3 }}
        sx={{
          position: "sticky",
          top: 64,
          height: "fit-content",
          overflowY: "visible",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          transition: "transform 0.2s ease-out",
          marginBottom: "0",
          paddingBottom: "24px", 
          alignSelf: "flex-start",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: (theme) => theme.palette.background.default,
          },
          "&::-webkit-scrollbar-thumb": {
            background: (theme) => theme.palette.divider,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: (theme) => theme.palette.text.disabled,
          },
        }}
      >
        {/* Help Content */}
        {showOrderSummary ? (
          <OrderSummary
            propertyId={propertyId || ""}
            packageType={propertyDetail.property_package}
            packagePrice={packagePrice}
            enhancements={currentEnhancements}
            publishOption={propertyDetail.publish_option || "immediately"}
            publishDate={
              propertyDetail.publish_date
                ? new Date(propertyDetail.publish_date)
                : null
            }
          />
        ) : tabValue === 9 ? (
          <EnhancementsSummary
            propertyId={propertyId || ""}
            isInSidebar={true}
          />
        ) : (
          <SectionHelp sectionIndex={tabValue} />
        )}

        {/* Skip This Section Note */}
        {tabValue !== 10 && (
          <Box sx={{ color: "text.secondary", fontStyle: "italic", my: 0 }}>
            You can skip this section and come back to it later
          </Box>
        )}

        {/* Navigation Buttons */}
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          gap: 1.5, 
          mt: 3,
          position: "relative",
          zIndex: 5
        }}>
          <Button
            variant="outlined"
            onClick={handleBack}
            size="large"
            disabled={loading || tabValue === 0}
            fullWidth
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleContinue}
            size="large"
            disabled={loading || tabValue === 10}
            data-feature-save
            fullWidth
          >
            {loading && actionType === "save" ? (
              <LoadingSpinner buttonMode text="Saving..." size={24} />
            ) : (
              "Continue"
            )}
          </Button>
        </Box>
      </Grid>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbarState.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}