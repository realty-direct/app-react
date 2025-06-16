import {
  Apartment,
  Book,
  Close,
  ContentPaste,
  Flight,
  Gavel,
  Landscape,
  Language,
  MovieCreation,
  PhotoCamera,
  PhotoLibrary,
  SignpostOutlined,
  Straighten,
  Style,
  ThreeDRotation,
} from "@mui/icons-material";
import {
  Box,
  Card,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useRealtyStore from "../store/store";

interface EnhancementsSummaryProps {
  propertyId: string;
  isInSidebar?: boolean; // New prop to determine positioning
}

// Enhancement type to match the data structure
interface Enhancement {
  id: string;
  title: string;
  price: string;
  numericPrice: number;
  icon: React.ReactNode;
}

// This matches the enhancements from ListingEnhancements.tsx with correct icons
const enhancementsData: Record<string, Enhancement> = {
  "photography-12": {
    id: "photography-12",
    title: "Professional Photography (12 images)",
    price: "$350",
    numericPrice: 350,
    icon: <PhotoCamera fontSize="small" color="primary" />,
  },
  "photography-20": {
    id: "photography-20",
    title: "Professional Photography (20 images)",
    price: "$470",
    numericPrice: 470,
    icon: <PhotoCamera fontSize="small" color="primary" />,
  },
  "drone-photography": {
    id: "drone-photography",
    title: "Drone/Aerial Photography",
    price: "$450",
    numericPrice: 450,
    icon: <Flight fontSize="small" color="primary" />,
  },
  "twilight-photography": {
    id: "twilight-photography",
    title: "Twilight Photography",
    price: "$480",
    numericPrice: 480,
    icon: <Landscape fontSize="small" color="primary" />,
  },
  "floor-plan-2d": {
    id: "floor-plan-2d",
    title: "2D Floor Plan",
    price: "$295",
    numericPrice: 295,
    icon: <Straighten fontSize="small" color="primary" />,
  },
  "virtual-tour": {
    id: "virtual-tour",
    title: "360° Virtual Tour",
    price: "$480",
    numericPrice: 480,
    icon: <ThreeDRotation fontSize="small" color="primary" />,
  },
  "walkthrough-video": {
    id: "walkthrough-video",
    title: "Walkthrough Video",
    price: "$560",
    numericPrice: 560,
    icon: <MovieCreation fontSize="small" color="primary" />,
  },
  "hd-video": {
    id: "hd-video",
    title: "HD Video",
    price: "$840",
    numericPrice: 840,
    icon: <MovieCreation fontSize="small" color="primary" />,
  },
  "virtual-staging": {
    id: "virtual-staging",
    title: "Virtual Staging",
    price: "$150 per image",
    numericPrice: 150,
    icon: <Style fontSize="small" color="primary" />,
  },
  "site-plan": {
    id: "site-plan",
    title: "Site Plan",
    price: "$80",
    numericPrice: 80,
    icon: <Straighten fontSize="small" color="primary" />,
  },
  "social-media-reels": {
    id: "social-media-reels",
    title: "Social Media Reels (2)",
    price: "$280",
    numericPrice: 280,
    icon: <PhotoLibrary fontSize="small" color="primary" />,
  },
  "print-package": {
    id: "print-package",
    title: "Print Package (50 booklets & 100 flyers)",
    price: "$220",
    numericPrice: 220,
    icon: <Book fontSize="small" color="primary" />,
  },
  "standard-signboard": {
    id: "standard-signboard",
    title: "Standard Signboard",
    price: "$190",
    numericPrice: 190,
    icon: <SignpostOutlined fontSize="small" color="primary" />,
  },
  "photo-signboard": {
    id: "photo-signboard",
    title: "Photo Signboard",
    price: "$310",
    numericPrice: 310,
    icon: <PhotoLibrary fontSize="small" color="primary" />,
  },
  "premium-description": {
    id: "premium-description",
    title: "Premium Property Description",
    price: "$180",
    numericPrice: 180,
    icon: <ContentPaste fontSize="small" color="primary" />,
  },
  "social-media-boost": {
    id: "social-media-boost",
    title: "Additional Social Media Boost",
    price: "$270",
    numericPrice: 270,
    icon: <Language fontSize="small" color="primary" />,
  },
  "allhomes-listing": {
    id: "allhomes-listing",
    title: "Listing on Allhomes.com.au",
    price: "$645",
    numericPrice: 645,
    icon: <Apartment fontSize="small" color="primary" />,
  },
  "juwai-listing": {
    id: "juwai-listing",
    title: "Listing on Juwai (China)",
    price: "$160",
    numericPrice: 160,
    icon: <Language fontSize="small" color="primary" />,
  },
  "contract-preparation": {
    id: "contract-preparation",
    title: "Sale Contract Preparation",
    price: "$534",
    numericPrice: 534,
    icon: <ContentPaste fontSize="small" color="primary" />,
  },
  conveyancing: {
    id: "conveyancing",
    title: "Full Conveyancing Service",
    price: "$880",
    numericPrice: 880,
    icon: <Gavel fontSize="small" color="primary" />,
  },
};

export default function EnhancementsSummary({
  propertyId,
  isInSidebar = true,
}: EnhancementsSummaryProps) {
  const theme = useTheme();
  const { getEnhancementsForProperty, removePropertyEnhancement } =
    useRealtyStore();

  const selectedEnhancements = getEnhancementsForProperty(propertyId);

  // Calculate total price of selected enhancements
  const totalPrice = selectedEnhancements.reduce((sum, enhancement) => {
    // Find the enhancement data to get the correct numericPrice
    const enhancementData = enhancementsData[enhancement.enhancement_type];
    // Only add to sum if we have matching data
    return enhancementData ? sum + enhancementData.numericPrice : sum;
  }, 0);

  const handleRemoveEnhancement = (enhancementId: string) => {
    removePropertyEnhancement(enhancementId);
  };

  if (selectedEnhancements.length === 0) {
    return (
      <Card
        elevation={2}
        sx={{
          position: "relative",
          borderRadius: 2,
          mb: 4,
          minWidth: isInSidebar ? 260 : "100%",
          width: "100%",
          height: "auto",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <Typography variant="h6">Selected Enhancements</Typography>
        </Box>

        {/* Empty state content */}
        <Box sx={{ p: 3, pb: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No enhancements selected yet. Choose from the options to add
            professional services to your listing.
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card
      elevation={3}
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "visible",
        mb: 3,
        width: "100%",
        maxWidth: "100%",
        maxHeight: isInSidebar ? "60vh" : "none",
        overflowY: isInSidebar ? "auto" : "visible",
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: "white",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <Typography variant="h6">Selected Enhancements</Typography>
      </Box>

      {/* Content */}
        <Box sx={{ p: 3 }}>
          {/* List selected enhancements */}
          <Box sx={{ mb: 2 }}>
            {selectedEnhancements.map((enhancement) => {
              const enhancementData =
                enhancementsData[enhancement.enhancement_type];
              return enhancementData ? (
                <Box
                  key={enhancement.id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    py: 1,
                    borderTop: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ mr: 1.5, pt: 0.5, flexShrink: 0 }}>
                      {enhancementData.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                          wordBreak: "break-word",
                        }}
                      >
                        {enhancementData.title}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mt: 0.5,
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                          sx={{
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                        >
                          {enhancementData.price}
                        </Typography>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleRemoveEnhancement(enhancement.id)
                          }
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : null;
            })}
          </Box>

          {/* Total */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              pt: 2,
              borderTop: `2px solid ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              ${totalPrice}
            </Typography>
          </Box>

          {/* Info text */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 2,
              fontStyle: "italic",
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            Your selected enhancements have been saved. They will be included in
            your final listing package when you proceed to checkout.
          </Typography>
        </Box>
    </Card>
  );
}
