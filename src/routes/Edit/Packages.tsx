import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid2,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

// Package types - this should match your database type
type PackageType = "ESSENTIAL" | "ADVANTAGE" | "PREMIUM" | null;

// Package data
const packages = [
  {
    id: "ESSENTIAL",
    title: "ESSENTIAL",
    price: 599,
    description: "Get your property online with the essentials",
    features: [
      "Realestate.com.au premier+ listing",
      "Domain Standard listing",
      "For Sale sign",
      "Automated enquiry system",
    ],
    color: "#4caf50", // Green
  },
  {
    id: "ADVANTAGE",
    title: "ADVANTAGE",
    price: 1299,
    description: "Stand out with professional marketing materials",
    features: [
      "Everything in Essential +",
      "Professional copywriting",
      "Floor plan",
      "Open home flyers",
      "Open home arrow board",
    ],
    color: "#2196f3", // Blue
    recommended: true,
  },
  {
    id: "PREMIUM",
    title: "PREMIUM",
    price: 1999,
    description: "Maximum exposure across all channels",
    features: [
      "Everything in Advantage +",
      "Domain.com.au Premier listing",
      "Listing on Juwai (China)",
      "Social media campaign",
    ],
    color: "#9c27b0", // Purple
  },
];

export default function Packages() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";
  const { propertyDetails, updatePropertyDetail } = useRealtyStore();

  // Find the current property
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  // Handle package selection - only update Zustand store
  const handlePackageSelect = (packageId: PackageType) => {
    // Use type assertion to handle the property_package
    updatePropertyDetail(propertyId, {
      property_package: packageId,
    });
  };

  // Format price as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(price);
  };

  if (!propertyDetail) {
    return <Typography>Property not found</Typography>;
  }

  // Get the currently selected package from the store with type assertion
  // @ts-ignore - Handle property_package that might not be in type definition
  const selectedPackage = propertyDetail.property_package as PackageType;

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Choose Your Listing Package
      </Typography>

      <Typography variant="body1">
        Select the package that best suits your needs. Each package offers
        different levels of exposure and marketing materials to maximize your
        property's appeal.
      </Typography>

      {/* Package Selection Cards */}
      <Grid2 container spacing={3} sx={{ mb: 6 }}>
        {packages.map((pkg) => (
          <Grid2 key={pkg.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={selectedPackage === pkg.id ? 8 : 2}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.3s ease",
                border:
                  selectedPackage === pkg.id
                    ? `2px solid ${pkg.color}`
                    : "2px solid transparent",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: theme.shadows[8],
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="h6" fontWeight="bold" align="center">
                    {pkg.title}
                  </Typography>
                }
                subheader={
                  <Typography
                    variant="h5"
                    align="center"
                    fontWeight="bold"
                    sx={{ mt: 1 }}
                  >
                    {formatPrice(pkg.price)}
                  </Typography>
                }
                sx={{
                  bgcolor:
                    selectedPackage === pkg.id
                      ? `${pkg.color}15`
                      : "transparent",
                  pb: 1,
                }}
              />

              <CardContent sx={{ flexGrow: 1, pt: 0 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                >
                  {pkg.description}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box>
                  {pkg.features.map((feature) => (
                    <Box
                      key={feature}
                      display="flex"
                      alignItems="center"
                      mb={1}
                      gap={1}
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: pkg.color }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: "center", p: 2 }}>
                <Button
                  variant={
                    selectedPackage === pkg.id ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={() => handlePackageSelect(pkg.id as PackageType)}
                  fullWidth
                  sx={{
                    py: 1,
                    bgcolor:
                      selectedPackage === pkg.id ? pkg.color : "transparent",
                    borderColor: pkg.color,
                    "&:hover": {
                      bgcolor:
                        selectedPackage === pkg.id
                          ? pkg.color
                          : `${pkg.color}15`,
                    },
                  }}
                >
                  {selectedPackage === pkg.id ? "Selected" : "Select Package"}
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}
      </Grid2>

      {/* Package Summary */}
      {selectedPackage && (
        <Paper elevation={3} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Your Selected Package
          </Typography>

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography>Package: {selectedPackage}</Typography>
            <Typography fontWeight="bold">
              {formatPrice(
                packages.find((pkg) => pkg.id === selectedPackage)?.price || 0
              )}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your selected package will be saved when you continue to the next
            step or save your changes.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
