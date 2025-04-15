import {
  Apartment,
  CheckCircleOutlined,
  Close,
  ContentPaste,
  Gavel,
  InfoOutlined,
  Language,
  PhotoCamera,
  Style,
  ThreeDRotation,
} from "@mui/icons-material";
import DroneIcon from "@mui/icons-material/FlightTakeoff";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import SignpostIcon from "@mui/icons-material/SignpostOutlined";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid2,
  IconButton,
  Paper,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { PropertyEnhancement } from "../../store/slices/enhancements.slice";
import useRealtyStore from "../../store/store";

// Enhancement type with expanded properties for modal view
interface Enhancement {
  id: string;
  category: string;
  title: string;
  price: string;
  numericPrice: number;
  description: string;
  longDescription?: string;
  icon: React.ReactNode;
  availability?: string;
  deliveryTime?: string;
  benefits?: string[];
  // Flag to mark exclusive options in a group (like signboard types)
  exclusiveGroup?: string;
}

// Streamlined enhancement data with only the requested services
const enhancements: Enhancement[] = [
  // Adding signboard options
  {
    id: "standard-signboard",
    category: "Signboards",
    title: "Standard Signboard",
    price: "$120",
    numericPrice: 120,
    description:
      "Professional 600×900mm 'For Sale' sign with your contact details. Made of high-quality corflute with steel frame.",
    longDescription:
      "Our standard signboard is a 600×900mm corflute sign mounted on a steel frame. It includes your property address, contact details, and basic branding. These signs are professionally printed for maximum visibility and durability outdoors.",
    icon: <SignpostIcon fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Installed within 3-5 business days",
    benefits: [
      "Increases property visibility to drive-by traffic",
      "Includes professional installation",
      "Weather-resistant for durability",
      "Helps interested parties contact you directly",
    ],
    exclusiveGroup: "signboard",
  },
  {
    id: "photo-signboard",
    category: "Signboards",
    title: "Photo Signboard",
    price: "$220",
    numericPrice: 220,
    description:
      "Premium signboard featuring a high-quality photo of your property, your contact details, and professional design.",
    longDescription:
      "Our photo signboards feature a high-resolution image of your property alongside key features and your contact information. These premium signs are larger (900×1200mm) and printed on high-quality materials for maximum visual impact. The photo helps potential buyers recognize your property and increases interest from drive-by traffic.",
    icon: <PhotoLibraryIcon fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Installed within 5-7 business days after photography",
    benefits: [
      "Visual showcase of your property to passersby",
      "50% larger than standard signboard for better visibility",
      "Includes professional installation",
      "Weather and UV-resistant for long-lasting quality",
      "Visual representation attracts more potential buyers",
    ],
    exclusiveGroup: "signboard",
  },
  {
    id: "virtual-staging",
    category: "Photography & Media",
    title: "Virtual Staging",
    price: "$40 per image",
    numericPrice: 40,
    description:
      "Make empty rooms more appealing with virtual furniture and decor, helping buyers visualize the potential.",
    longDescription:
      "Our virtual staging service digitally furnishes your empty rooms with stylish, appropriate furniture and decor. This helps potential buyers visualize the potential of each space without the expense of physical staging. Our designers carefully select furnishings that complement your property's style and highlight its best features.",
    icon: <Style fontSize="large" color="primary" />,
    availability: "Available for any property",
    deliveryTime: "Delivered within 2 business days",
    benefits: [
      "Costs a fraction of physical staging",
      "Helps buyers visualize the potential of empty spaces",
      "Can be applied to multiple different styles for the same room",
      "Before and after images included",
    ],
  },
  {
    id: "photography",
    category: "Photography & Media",
    title: "Professional Photography",
    price: "$350",
    numericPrice: 350,
    description:
      "High-quality professional photography to showcase your property in the best light. Subject to availability.",
    longDescription:
      "Our professional photographers use high-end equipment and advanced techniques to capture your property in the best possible light. After the shoot, our editing team meticulously retouches each image to ensure perfect colors, lighting, and perspective. This package includes up to 15 professionally edited photos delivered within 48 hours of the shoot.",
    icon: <PhotoCamera fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Photos delivered within 48 hours after shoot",
    benefits: [
      "Properties with professional photos receive up to 61% more views online",
      "Professional photography can help sell your property 32% faster",
      "Bright, clear images encourage potential buyers to book inspections",
      "Includes twilight shots for exterior where appropriate",
    ],
  },
  {
    id: "drone-photography",
    category: "Photography & Media",
    title: "Drone/Aerial Photography",
    price: "$280",
    numericPrice: 280,
    description:
      "Showcase your property's location, land size, and surroundings with breathtaking aerial photography. Subject to availability.",
    longDescription:
      "Our certified drone operators capture stunning aerial images that highlight your property's position, orientation, and surrounding environment. These unique perspectives are particularly valuable for large properties, those with acreage, or homes with special features like pools or impressive landscaping.",
    icon: <DroneIcon fontSize="large" color="primary" />,
    availability: "Subject to weather conditions and airspace restrictions",
    deliveryTime: "Images delivered within 3 business days",
    benefits: [
      "Shows the full extent of your property and land",
      "Highlights proximity to amenities and natural features",
      "Provides unique perspectives unavailable with standard photography",
      "Includes 5-10 high-resolution aerial images",
    ],
  },
  {
    id: "3d-tour",
    category: "Photography & Media",
    title: "3D Virtual Tour",
    price: "$560",
    numericPrice: 560,
    description:
      "Create an immersive experience for buyers with a 3D virtual tour of your property. Subject to availability.",
    longDescription:
      "Using state-of-the-art Matterport technology, we create immersive, interactive 3D tours that allow potential buyers to walk through your property virtually at any time. These tours provide a realistic sense of space and flow that photos alone cannot achieve, making your listing stand out from the competition.",
    icon: <ThreeDRotation fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Tour live within 48 hours after scan",
    benefits: [
      "Available 24/7 for potential buyers to explore at their convenience",
      "Reduces unnecessary physical inspections",
      "Allows interstate and international buyers to view your property",
      "Includes dollhouse view and floor plan generation",
    ],
  },
  {
    id: "premium-copy",
    category: "Content & Marketing",
    title: "Premium Copywriting (Story-based)",
    price: "$180",
    numericPrice: 180,
    description:
      "Take your property listing to the next level with premium storytelling that creates an emotional connection with potential buyers.",
    longDescription:
      "Our premium copywriting service goes beyond describing features to tell the compelling story of your home. Through narrative techniques and evocative language, we help buyers imagine the lifestyle your property offers. This premium service includes an in-depth interview about your property's history and unique aspects.",
    icon: <ContentPaste fontSize="large" color="primary" />,
    availability: "Available immediately",
    deliveryTime: "Draft delivered within 3 business days",
    benefits: [
      "Creates an emotional narrative around your property",
      "Includes research into the neighborhood and local amenities",
      "Positions your property within its historical and community context",
      "Includes revisions based on your feedback",
    ],
  },
  {
    id: "allhomes-listing",
    category: "Additional Exposure",
    title: "Listing on Allhomes.com.au",
    price: "$645",
    numericPrice: 645,
    description:
      "Get additional exposure on Allhomes, a leading property platform in the ACT region.",
    longDescription:
      "Allhomes.com.au is the dominant real estate website in the ACT region, with many local buyers checking this platform exclusively. This package ensures your property is prominently featured on Allhomes for the duration of your campaign, expanding your reach beyond the main national portals and capturing the attention of this important regional audience.",
    icon: <Apartment fontSize="large" color="primary" />,
    availability: "Best for properties in ACT and surrounding regions",
    deliveryTime: "Listed within 1-2 business days",
    benefits: [
      "Reaches buyers who primarily use Allhomes",
      "Includes featured position for the first week",
      "Full integration with your existing listing details",
      "30-day listing duration",
    ],
  },
  {
    id: "juwai-listing",
    category: "Additional Exposure",
    title: "Listing on Juwai (China)",
    price: "$160",
    numericPrice: 160,
    description:
      "Reach international buyers! Juwai is China's leading real estate platform, showcasing properties to a global audience.",
    longDescription:
      "Expand your property's reach to the international market with a listing on Juwai.com, China's largest international property portal. Your listing will be translated into Chinese and optimized for this specialized audience. This is particularly valuable for properties that may appeal to international investors or buyers looking for homes for family members studying in Australia.",
    icon: <Language fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Live within 3-5 business days",
    benefits: [
      "Exposes your property to China's largest buyer market",
      "Professional translation of all property details",
      "Includes inquiry handling and translation services",
      "30-day premium placement",
    ],
  },
  {
    id: "contract-no-strata",
    category: "Legal Services",
    title: "Sale Contract Preparation",
    price: "$534",
    numericPrice: 534,
    description:
      "Professional preparation of your property sale contract by qualified conveyancers. Required before advertising in many states.",
    longDescription:
      "Our professional conveyancers will prepare a comprehensive sales contract that complies with all legal requirements. This includes title searches, zoning certificates, sewer diagrams, and all other required documentation. Having a properly prepared contract ready when you list helps avoid delays and ensures you're legally compliant.",
    icon: <ContentPaste fontSize="large" color="primary" />,
    availability: "Required before advertising in many states",
    deliveryTime: "5-7 business days",
    benefits: [
      "Legally compliant documentation",
      "Includes all required property searches",
      "Prepared by qualified conveyancers",
      "Avoids delays when you find a buyer",
    ],
  },
  {
    id: "conveyancing",
    category: "Legal Services",
    title: "Full Conveyancing Service",
    price: "$880",
    numericPrice: 880,
    description:
      "Complete end-to-end conveyancing service for your property sale, handling all legal aspects from contract to settlement.",
    longDescription:
      "Our comprehensive conveyancing service manages all legal aspects of your property sale from start to finish. This includes contract preparation, handling of deposits, coordination with the buyer's legal representatives, preparation of transfer documents, and attendance at settlement. Our experienced conveyancers ensure everything proceeds legally and efficiently.",
    icon: <Gavel fontSize="large" color="primary" />,
    availability: "Available for all property sales",
    deliveryTime: "Throughout the entire sales process",
    benefits: [
      "Eliminates legal stress and complexity from your sale",
      "Ensures all statutory requirements are met",
      "Handles negotiations of special conditions",
      "Manages critical deadlines and settlement procedures",
    ],
  },
];

export default function ListingEnhancements() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  // Access Zustand store functions for enhancements
  const {
    propertyEnhancements,
    addPropertyEnhancement,
    removePropertyEnhancement,
    getEnhancementsForProperty,
  } = useRealtyStore();

  // Get enhancements for this property
  const propertySpecificEnhancements = getEnhancementsForProperty(propertyId);

  // Extract enhancement types for selection checking
  const selectedEnhancements = propertySpecificEnhancements.map(
    (e) => e.enhancement_type
  );

  // Local state for UI interactions
  const [openModal, setOpenModal] = useState(false);
  const [currentEnhancement, setCurrentEnhancement] =
    useState<Enhancement | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Calculate total price of selected enhancements
  const totalPrice = propertySpecificEnhancements.reduce((sum, enhancement) => {
    return sum + enhancement.price;
  }, 0);

  // Handle opening the modal with the selected enhancement
  const handleOpenModal = (enhancement: Enhancement) => {
    setCurrentEnhancement(enhancement);
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Handle toggle enhancement - ONLY manipulate Zustand store, no DB calls
  const handleToggleEnhancement = (enhancementId: string) => {
    try {
      const isCurrentlySelected = selectedEnhancements.includes(enhancementId);
      const enhancement = enhancements.find((e) => e.id === enhancementId);

      if (!enhancement) return;

      if (isCurrentlySelected) {
        // Find the enhancement in the store to get its ID
        const enhancementToRemove = propertySpecificEnhancements.find(
          (e) => e.enhancement_type === enhancementId
        );

        if (enhancementToRemove?.id) {
          // Remove from the Zustand store only - no DB call
          removePropertyEnhancement(enhancementToRemove.id);

          setSnackbarMessage(`${enhancement.title} removed from selections`);
          setSnackbarOpen(true);
        }
      } else {
        // For exclusive groups (like signboards), remove any existing selections
        if (enhancement.exclusiveGroup) {
          // Find all enhancements in the same exclusive group
          const sameGroupEnhancements = enhancements.filter(
            (e) => e.exclusiveGroup === enhancement.exclusiveGroup
          );

          // Find and remove any selected enhancements from this group
          for (const groupEnhancement of sameGroupEnhancements) {
            if (selectedEnhancements.includes(groupEnhancement.id)) {
              const existingEnhancement = propertySpecificEnhancements.find(
                (e) => e.enhancement_type === groupEnhancement.id
              );

              if (existingEnhancement?.id) {
                // Remove from the Zustand store only - no DB call
                removePropertyEnhancement(existingEnhancement.id);
              }
            }
          }
        }

        // Add the enhancement to the store - with a temporary ID
        const newEnhancement: PropertyEnhancement = {
          id: `temp-${Date.now()}-${enhancementId}`, // Add a temporary ID
          property_id: propertyId,
          enhancement_type: enhancementId,
          price: enhancement.numericPrice,
          status: "pending",
        };

        addPropertyEnhancement(newEnhancement);
        setSnackbarMessage(`${enhancement.title} added to selections`);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error toggling enhancement:", error);
      setSnackbarMessage("Error updating selections");
      setSnackbarOpen(true);
    }
  };

  const handleAddFromModal = () => {
    if (currentEnhancement) {
      handleToggleEnhancement(currentEnhancement.id);
    }
    handleCloseModal();
  };

  // Group enhancements by category
  const enhancementsByCategory = enhancements.reduce(
    (acc, enhancement) => {
      if (!acc[enhancement.category]) {
        acc[enhancement.category] = [];
      }
      acc[enhancement.category].push(enhancement);
      return acc;
    },
    {} as Record<string, Enhancement[]>
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Listing Enhancements
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Enhance your property listing with these professional services. Select
          the options that best showcase your property and help it stand out
          from the competition.
        </Typography>
      </Paper>

      {/* Render each category */}
      {Object.entries(enhancementsByCategory).map(([category, items]) => (
        <Box key={category} sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="h6"
            sx={{
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
              mb: 3,
              color: "primary.main",
            }}
          >
            {category}
          </Typography>

          <Grid2 container spacing={3}>
            {items.map((enhancement) => {
              const isSelected = selectedEnhancements.includes(enhancement.id);

              return (
                <Grid2
                  key={`${category}-${enhancement.id}`}
                  size={{ xs: 12, sm: 6, md: 4 }}
                >
                  <Card
                    elevation={isSelected ? 3 : 1}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      border: isSelected
                        ? `2px solid ${theme.palette.success.main}`
                        : "2px solid transparent",
                      position: "relative",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[4],
                      },
                    }}
                  >
                    {isSelected && (
                      <Chip
                        icon={<CheckCircleOutlined />}
                        label="Selected"
                        color="success"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          zIndex: 1,
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        height: 120,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "background.default",
                        borderRadius: "4px 4px 0 0",
                      }}
                    >
                      {enhancement.icon}
                    </Box>

                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        sx={{ fontWeight: "medium" }}
                      >
                        {enhancement.title}
                      </Typography>

                      <Typography
                        variant="h6"
                        color="primary"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {enhancement.price}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {enhancement.description}
                      </Typography>

                      {enhancement.availability && (
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{
                            fontStyle: "italic",
                            color: "text.secondary",
                            mt: "auto",
                          }}
                        >
                          {enhancement.availability}
                        </Typography>
                      )}
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                      <Button
                        size="small"
                        onClick={() => handleOpenModal(enhancement)}
                        startIcon={<InfoOutlined />}
                      >
                        Read More
                      </Button>

                      <Button
                        variant={isSelected ? "outlined" : "contained"}
                        color={isSelected ? "error" : "primary"}
                        size="small"
                        onClick={() => handleToggleEnhancement(enhancement.id)}
                      >
                        {isSelected ? "Remove" : "Add"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>
        </Box>
      ))}

      {/* Selected enhancements summary - at the bottom */}
      {selectedEnhancements.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mt: 4,
            mb: 4,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Selected Enhancements
          </Typography>

          <Box sx={{ mb: 2 }}>
            {selectedEnhancements.map((id) => {
              const enhancement = enhancements.find((e) => e.id === id);
              return enhancement ? (
                <Box
                  key={id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 1,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ display: "flex", mr: 2 }}>
                      {enhancement.icon}
                    </Box>
                    <Typography>{enhancement.title}</Typography>
                  </Box>
                  <Typography fontWeight="bold">{enhancement.price}</Typography>
                </Box>
              ) : null;
            })}
          </Box>

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

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, fontStyle: "italic" }}
          >
            Your selected enhancements have been saved. To proceed with your
            listing, click the "Continue" button at the bottom of the page.
          </Typography>
        </Paper>
      )}

      {/* Detail Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        scroll="paper"
      >
        {currentEnhancement && (
          <>
            <DialogTitle sx={{ pr: 6 }}>
              {currentEnhancement.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: "text.secondary",
                }}
              >
                <Close />
              </IconButton>
            </DialogTitle>

            <DialogContent dividers>
              <Grid2 container spacing={3}>
                {/* Icon and basic info */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 120,
                      width: "100%",
                      backgroundColor: "background.default",
                      borderRadius: 1,
                      mb: 2,
                    }}
                  >
                    {currentEnhancement.icon}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h5"
                      color="primary"
                      fontWeight="bold"
                      gutterBottom
                    >
                      {currentEnhancement.price}
                    </Typography>

                    <Typography variant="body2" paragraph>
                      {currentEnhancement.longDescription ||
                        currentEnhancement.description}
                    </Typography>
                  </Box>
                </Grid2>

                {/* Details and features */}
                <Grid2 size={{ xs: 12, md: 6 }}>
                  {currentEnhancement.availability && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Availability
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {currentEnhancement.availability}
                      </Typography>
                    </Box>
                  )}

                  {currentEnhancement.deliveryTime && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        Delivery
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {currentEnhancement.deliveryTime}
                      </Typography>
                    </Box>
                  )}

                  {currentEnhancement.benefits &&
                    currentEnhancement.benefits.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight="bold"
                          gutterBottom
                        >
                          Benefits
                        </Typography>
                        {currentEnhancement.benefits.map((benefit, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <CheckCircleOutlined
                              sx={{
                                color: "success.main",
                                mr: 1,
                                fontSize: 18,
                              }}
                            />
                            <Typography variant="body2">{benefit}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                </Grid2>
              </Grid2>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
              <Button onClick={handleCloseModal}>Close</Button>
              <Button
                variant="contained"
                color={
                  selectedEnhancements.includes(currentEnhancement.id)
                    ? "error"
                    : "primary"
                }
                onClick={
                  selectedEnhancements.includes(currentEnhancement.id)
                    ? () => {
                        handleToggleEnhancement(currentEnhancement.id);
                        handleCloseModal();
                      }
                    : handleAddFromModal
                }
              >
                {selectedEnhancements.includes(currentEnhancement.id)
                  ? "Remove Selection"
                  : "Add Selection"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}
