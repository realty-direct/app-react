import {
  Apartment,
  Book,
  CheckCircleOutlined,
  Close,
  ContentPaste,
  Flight,
  Gavel,
  InfoOutlined,
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
  Grid,
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
  exclusiveGroup?: string;
  wholesaleCost?: number;
  margin?: string;
}

const enhancements: Enhancement[] = [
  {
    id: "photography-12",
    category: "Photography Services",
    title: "Professional Photography (12 images)",
    price: "$350",
    numericPrice: 350,
    wholesaleCost: 250,
    margin: "28.6%",
    description:
      "High-quality professional photography to showcase your property in the best light. Package includes 12 professionally edited images.",
    longDescription:
      "Our professional photographers use high-end equipment and advanced techniques to capture your property in the best possible light. After the shoot, our editing team meticulously retouches each image to ensure perfect colors, lighting, and perspective. This package includes 12 professionally edited photos delivered within 48 hours of the shoot.",
    icon: <PhotoCamera fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Photos delivered within 48 hours after shoot",
    benefits: [
      "Properties with professional photos receive up to 61% more views online",
      "Professional photography can help sell your property 32% faster",
      "Bright, clear images encourage potential buyers to book inspections",
      "Includes carefully selected angles to showcase your property's best features",
    ],
  },
  {
    id: "photography-20",
    category: "Photography Services",
    title: "Professional Photography (20 images)",
    price: "$470",
    numericPrice: 470,
    wholesaleCost: 335,
    margin: "28.6%",
    description:
      "Extended photography package with 20 high-quality professional images to showcase every aspect of your property.",
    longDescription:
      "Our premium photography package includes 20 professionally captured and edited images of your property. This comprehensive package ensures every room and feature is showcased in the best possible light. Perfect for larger properties or when you want to highlight numerous special features. Our photographers use professional-grade equipment and advanced editing techniques to ensure your property stands out from the competition.",
    icon: <PhotoCamera fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Photos delivered within 48 hours after shoot",
    benefits: [
      "8 additional images compared to the standard package",
      "More comprehensive coverage of your property's features",
      "Ideal for larger homes or properties with extensive outdoor areas",
      "Allows potential buyers to see more details before booking an inspection",
    ],
  },
  {
    id: "drone-photography",
    category: "Photography Services",
    title: "Drone/Aerial Photography",
    price: "$450",
    numericPrice: 450,
    wholesaleCost: 340,
    margin: "24.4%",
    description:
      "Showcase your property's location, land size, and surroundings with breathtaking aerial photography. Subject to availability.",
    longDescription:
      "Our certified drone operators capture stunning aerial images that highlight your property's position, orientation, and surrounding environment. These unique perspectives are particularly valuable for large properties, those with acreage, or homes with special features like pools or impressive landscaping. Includes 5-8 high-resolution aerial images.",
    icon: <Flight fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Images delivered within 3 business days",
    benefits: [
      "Shows the full extent of your property and land",
      "Highlights proximity to amenities and natural features",
      "Provides unique perspectives unavailable with standard photography",
      "Includes 5-8 high-resolution aerial images",
    ],
  },
  {
    id: "twilight-photography",
    category: "Photography Services",
    title: "Twilight Photography",
    price: "$480",
    numericPrice: 480,
    wholesaleCost: 345,
    margin: "28.2%",
    description:
      "Dramatic twilight photos that showcase your property in the magical evening light, creating an emotional connection with buyers.",
    longDescription:
      "Twilight photography captures your property in the golden hour and blue hour lighting, creating dramatic and emotional images that stand out in listings. These photos highlight architectural features, lighting design, and create a warm, inviting atmosphere. Our photographers use specialized techniques to balance interior and exterior lighting for the most flattering results.",
    icon: <Landscape fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Images delivered within 48 hours after shoot",
    benefits: [
      "Creates an emotional connection with potential buyers",
      "Makes your listing stand out from standard daytime photos",
      "Highlights architectural features and landscape lighting",
      "Among the most effective types of real estate photography for engagement",
    ],
  },
  {
    id: "floor-plan-2d",
    category: "Photography Services",
    title: "2D Floor Plan",
    price: "$295",
    numericPrice: 295,
    wholesaleCost: 205,
    margin: "30.5%",
    description:
      "Professional 2D floor plan to help buyers understand the layout and flow of your property. Essential for serious buyers.",
    longDescription:
      "Our professional 2D floor plans provide a clear visual representation of your property's layout. These accurate floor plans include room dimensions, door positions, and key architectural features. Buyers consistently rate floor plans as one of the most important elements when browsing properties online, helping them understand the flow and functionality of the space before inspection.",
    icon: <Straighten fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Delivered within 3-5 business days",
    benefits: [
      "Helps buyers understand property layout before inspection",
      "Includes accurate measurements of all rooms",
      "Consistent with survey requirements",
      "Reduces irrelevant inquiries from buyers seeking different layouts",
    ],
  },
  {
    id: "virtual-tour",
    category: "Photography Services",
    title: "360° Virtual Tour",
    price: "$480",
    numericPrice: 480,
    wholesaleCost: 340,
    margin: "29.2%",
    description:
      "Create an immersive experience for buyers with a 3D virtual tour of your property. Allows buyers to 'walk through' your home online.",
    longDescription:
      "Using state-of-the-art Matterport technology, we create immersive, interactive 3D tours that allow potential buyers to walk through your property virtually at any time. These tours provide a realistic sense of space and flow that photos alone cannot achieve, making your listing stand out from the competition. Includes dollhouse view and floor plan generation.",
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
    id: "walkthrough-video",
    category: "Photography Services",
    title: "Walkthrough Video",
    price: "$560",
    numericPrice: 560,
    wholesaleCost: 415,
    margin: "25.9%",
    description:
      "Professional guided video walkthrough of your property, showcasing the flow and highlighting key features with expert narration.",
    longDescription:
      "Our walkthrough videos provide a guided tour of your property with professional narration highlighting key features and benefits. Using stabilized camera equipment and professional editing, these videos create a natural viewing experience similar to an in-person inspection. The final product includes background music, text overlays for key features, and professional color grading.",
    icon: <MovieCreation fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "Video delivered within 5 business days",
    benefits: [
      "Showcases the natural flow between rooms and spaces",
      "Professional narration highlights key selling points",
      "Increases engagement on listings by up to 40%",
      "Easy sharing on social media to expand your reach",
    ],
  },
  {
    id: "hd-video",
    category: "Photography Services",
    title: "HD Video",
    price: "$840",
    numericPrice: 840,
    wholesaleCost: 630,
    margin: "25.0%",
    description:
      "Premium cinematic video production showcasing your property with professional cinematography, editing, and soundtrack.",
    longDescription:
      "Our premium HD video package transforms your property listing into a cinematic experience with professional camera work, drone footage, advanced editing techniques, and carefully selected music. This Hollywood-style approach creates an emotional connection with viewers and showcases lifestyle benefits beyond just the physical features. Includes script development, professional narrator, and multiple revision options.",
    icon: <MovieCreation fontSize="large" color="primary" />,
    availability: "Subject to availability in your area",
    deliveryTime: "7-10 business days for delivery",
    benefits: [
      "Cinematic quality filming and editing",
      "Combines ground and aerial footage seamlessly",
      "Creates emotional connection through storytelling",
      "Can be used across multiple marketing channels",
      "Includes social media optimized versions",
    ],
  },
  {
    id: "virtual-staging",
    category: "Photography Services",
    title: "Virtual Staging",
    price: "$150 per image",
    numericPrice: 150,
    wholesaleCost: 115,
    margin: "23.3%",
    description:
      "Make empty rooms more appealing with virtual furniture and decor, helping buyers visualize the potential.",
    longDescription:
      "Our virtual staging service digitally furnishes your empty rooms with stylish, appropriate furniture and decor. This helps potential buyers visualize the potential of each space without the expense of physical staging. Our designers carefully select furnishings that complement your property's style and highlight its best features. We can create multiple style options for the same room if needed.",
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
    id: "site-plan",
    category: "Photography Services",
    title: "Site Plan",
    price: "$80",
    numericPrice: 80,
    wholesaleCost: 55,
    margin: "31.3%",
    description:
      "Professional site plan showing property boundaries, key features, and orientation. Essential for larger blocks and development potential.",
    longDescription:
      "Our site plans provide a clear aerial view of your property showing lot boundaries, building footprint, orientation, and key external features like driveways, pools, and gardens. These plans help buyers understand the full context of your property and are particularly valuable for larger blocks or properties with development potential. Created from a combination of aerial imagery and property documentation.",
    icon: <Straighten fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Delivered within 3 business days",
    benefits: [
      "Shows property boundaries and orientation",
      "Highlights external features like pools and gardens",
      "Useful for understanding development potential",
      "Complements floor plans for complete property understanding",
    ],
  },

  {
    id: "social-media-reels",
    category: "Marketing Materials",
    title: "Social Media Reels (2)",
    price: "$280",
    numericPrice: 280,
    wholesaleCost: 210,
    margin: "25.0%",
    description:
      "Two professionally created social media reels optimized for Instagram and Facebook to maximize your property's online reach.",
    longDescription:
      "Our social media reels package includes two professionally edited short-form videos designed specifically for social media platforms. These attention-grabbing 15-30 second videos highlight your property's best features with trendy transitions, text overlays, and appropriate music. Formatted for optimal performance on Instagram, Facebook, and TikTok, these reels significantly expand your property's online visibility.",
    icon: <PhotoLibrary fontSize="large" color="primary" />,
    availability: "Available for all properties with photography",
    deliveryTime: "Delivered within 3 business days after photography",
    benefits: [
      "Increases reach through social media sharing",
      "Optimized for mobile viewing experience",
      "Format performs better in social algorithms than static images",
      "Includes license-free music and professional text overlays",
    ],
  },
  {
    id: "print-package",
    category: "Marketing Materials",
    title: "Print Package (50 booklets & 100 flyers)",
    price: "$220",
    numericPrice: 220,
    wholesaleCost: 170,
    margin: "22.7%",
    description:
      "Comprehensive print materials including high-quality property booklets and flyers for inspections and letterbox drops.",
    longDescription:
      "Our print package includes 50 high-quality property booklets (4-8 pages) showcasing professional photos, floor plans, and property details, plus 100 single-page flyers ideal for letterbox drops and inspection handouts. All materials are printed on premium stock with professional design and layout. Includes property features, neighborhood highlights, and agent contact details.",
    icon: <Book fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "5-7 business days after photography",
    benefits: [
      "Professional take-home materials for open houses",
      "Increases memorability after property viewings",
      "Letterbox drop flyers to target local buyers",
      "QR codes linking to online listing for extended information",
    ],
  },
  {
    id: "standard-signboard",
    category: "Marketing Materials",
    title: "Standard Signboard",
    price: "$190",
    numericPrice: 190,
    wholesaleCost: 140,
    margin: "26.3%",
    description:
      "Professional 600×900mm 'For Sale' sign with your contact details. Made of high-quality corflute with steel frame.",
    longDescription:
      "Our standard signboard is a 600×900mm corflute sign mounted on a steel frame. It includes your property address, contact details, and basic branding. These signs are professionally printed for maximum visibility and durability outdoors. Installation included at your property.",
    icon: <SignpostOutlined fontSize="large" color="primary" />,
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
    category: "Marketing Materials",
    title: "Photo Signboard",
    price: "$310",
    numericPrice: 310,
    wholesaleCost: 240,
    margin: "22.6%",
    description:
      "Premium signboard featuring a high-quality photo of your property, your contact details, and professional design.",
    longDescription:
      "Our photo signboards feature a high-resolution image of your property alongside key features and your contact information. These premium signs are larger (900×1200mm) and printed on high-quality materials for maximum visual impact. The photo helps potential buyers recognize your property and increases interest from drive-by traffic.",
    icon: <PhotoLibrary fontSize="large" color="primary" />,
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
    id: "premium-description",
    category: "Marketing Materials",
    title: "Premium Property Description",
    price: "$180",
    numericPrice: 180,
    wholesaleCost: 10,
    margin: "94.4%",
    description:
      "Professional, compelling property description that highlights key features and creates emotional connection with potential buyers.",
    longDescription:
      "Our premium property descriptions are crafted by professional copywriters who specialize in real estate marketing. Going beyond basic features, they tell the story of your property and the lifestyle it offers. Using evocative language and strategic keyword placement, these descriptions help your listing stand out in search results while creating an emotional connection with potential buyers.",
    icon: <ContentPaste fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Delivered within 2 business days",
    benefits: [
      "Creates emotional connection with potential buyers",
      "Optimized for search engine visibility",
      "Highlights unique selling points and lifestyle benefits",
      "Written by specialists in real estate copywriting",
      "Includes up to two rounds of revisions",
    ],
  },

  {
    id: "social-media-boost",
    category: "Additional Exposure",
    title: "Additional Social Media Boost",
    price: "$270",
    numericPrice: 270,
    wholesaleCost: 199,
    margin: "26.3%",
    description:
      "Targeted social media campaign promoting your property to potential buyers based on location, interests, and buying signals.",
    longDescription:
      "Our social media boost package creates and manages targeted advertising campaigns for your property across Facebook, Instagram, and Google. Using advanced audience targeting, we reach potential buyers based on location, demographics, interests, and recent property-seeking behavior. Includes custom ad creation, campaign management, and performance reporting.",
    icon: <Language fontSize="large" color="primary" />,
    availability: "Available for all property types",
    deliveryTime: "Campaign live within 2 business days",
    benefits: [
      "Targets likely buyers based on behavior and interests",
      "Reaches potential buyers who aren't actively searching listings",
      "Campaign runs for 14 days with performance optimization",
      "Includes performance report with reach and engagement metrics",
      "Average of 10,000+ targeted impressions",
    ],
  },
  {
    id: "allhomes-listing",
    category: "Additional Exposure",
    title: "Listing on Allhomes.com.au",
    price: "$645",
    numericPrice: 645,
    wholesaleCost: 520,
    margin: "19.4%",
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
    wholesaleCost: 120,
    margin: "25.0%",
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
    id: "contract-preparation",
    category: "Legal Services",
    title: "Sale Contract Preparation",
    price: "$534",
    numericPrice: 534,
    wholesaleCost: 450,
    margin: "15.7%",
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
    wholesaleCost: 770,
    margin: "12.5%",
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

  const {
    propertyEnhancements,
    addPropertyEnhancement,
    removePropertyEnhancement,
    getEnhancementsForProperty,
  } = useRealtyStore();

  const propertySpecificEnhancements = getEnhancementsForProperty(propertyId);

  const selectedEnhancements = propertySpecificEnhancements.map(
    (e) => e.enhancement_type
  );

  const [openModal, setOpenModal] = useState(false);
  const [currentEnhancement, setCurrentEnhancement] =
    useState<Enhancement | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(enhancements.map((enhancement) => enhancement.category))
  );

  const totalPrice = propertySpecificEnhancements.reduce((sum, enhancement) => {
    return sum + enhancement.price;
  }, 0);

  const handleOpenModal = (enhancement: Enhancement) => {
    setCurrentEnhancement(enhancement);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleToggleEnhancement = (enhancementId: string) => {
    try {
      const isCurrentlySelected = selectedEnhancements.includes(enhancementId);
      const enhancement = enhancements.find((e) => e.id === enhancementId);

      if (!enhancement) return;

      if (isCurrentlySelected) {
        const enhancementToRemove = propertySpecificEnhancements.find(
          (e) => e.enhancement_type === enhancementId
        );

        if (enhancementToRemove?.id) {
          removePropertyEnhancement(enhancementToRemove.id);

          setSnackbarMessage(`${enhancement.title} removed from selections`);
          setSnackbarOpen(true);
        }
      } else {
        if (enhancement.exclusiveGroup) {
          const sameGroupEnhancements = enhancements.filter(
            (e) => e.exclusiveGroup === enhancement.exclusiveGroup
          );

          for (const groupEnhancement of sameGroupEnhancements) {
            if (selectedEnhancements.includes(groupEnhancement.id)) {
              const existingEnhancement = propertySpecificEnhancements.find(
                (e) => e.enhancement_type === groupEnhancement.id
              );

              if (existingEnhancement?.id) {
                removePropertyEnhancement(existingEnhancement.id);
              }
            }
          }
        }

        const newEnhancement: PropertyEnhancement = {
          id: `temp-${Date.now()}-${enhancementId}`,
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

  const filteredEnhancements = activeCategory
    ? enhancements.filter(
        (enhancement) => enhancement.category === activeCategory
      )
    : enhancements;

  const enhancementsByCategory = filteredEnhancements.reduce(
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
    <Box sx={{ p: { xs: 2, sm: 6 }, mb: 6 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Listing Enhancements
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Enhance your property listing with these professional services. Select
          the options that best showcase your property and help it stand out
          from the competition.
        </Typography>
      </Paper>

      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button
          variant={activeCategory === null ? "contained" : "outlined"}
          onClick={() => setActiveCategory(null)}
          sx={{ mb: 1 }}
        >
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "contained" : "outlined"}
            onClick={() => setActiveCategory(category)}
            sx={{ mb: 1 }}
          >
            {category}
          </Button>
        ))}
      </Box>

      {Object.entries(enhancementsByCategory).map(([category, items]) => (
        <Box key={category} sx={{ mt: 4, mb: 6 }}>
          <Typography
            variant="h6"
            sx={{
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1,
              mb: 3,
              color: "primary.main",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {category}
          </Typography>

          <Grid container spacing={3}>
            {items.map((enhancement) => {
              const isSelected = selectedEnhancements.includes(enhancement.id);

              return (
                <Grid
                  size={{ xs: 12, sm: 4, md: 4 }}
                  key={`${category}-${enhancement.id}`}
                >
                  <Card
                    elevation={isSelected ? 3 : 1}
                    sx={{
                      height: "100%",
                      maxWidth: 345,
                      width: "100%",
                      margin: "0 auto",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      border: isSelected
                        ? `2px solid ${theme.palette.success.main}`
                        : "2px solid transparent",
                      position: "relative",
                      backgroundColor: isSelected
                        ? "action.selected"
                        : "background.paper",
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
                        height: 100,
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
                        Details
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
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

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
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
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

                    {currentEnhancement.wholesaleCost && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mb: 1,
                          fontStyle: "italic",
                        }}
                      >
                        Margin: {currentEnhancement.margin}
                      </Typography>
                    )}

                    <Typography variant="body2" paragraph>
                      {currentEnhancement.longDescription ||
                        currentEnhancement.description}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
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
                </Grid>
              </Grid>
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
