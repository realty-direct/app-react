import { Box, Button, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router";

import {
  Bathtub,
  BrokenImageOutlined,
  DirectionsCar,
  KingBed,
  SquareFoot,
} from "@mui/icons-material";
import useRealtyStore from "../store/store";

const Property = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // ✅ Get the property ID from the route
  const { properties, propertyDetails } = useRealtyStore();

  // ✅ Try to find the property in Zustand store first
  const property = properties.find((p) => p.id === id);

  const details = propertyDetails.find((p) => p.property_id === id);

  // ✅ If the property isn't found, show an error message instead of fetching again
  if (!property) {
    return (
      <Typography color="error" variant="h6">
        Property not found. Please check if your properties have loaded.
      </Typography>
    );
  }

  const routeToEditProperty = () => {
    navigate(`/property/${property.id}/edit`);
  };

  // Property attribute components with icons
  const PropertyAttribute = ({
    icon,
    value,
    label,
  }: {
    icon: React.ReactNode;
    value?: string | number | null;
    label: string;
  }) => (
    <Tooltip title={value ? `${value} ${label}` : `Add ${label}`}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          opacity: value ? 1 : 0.6,
        }}
      >
        {icon}
        <Typography variant="body2" fontWeight="medium">
          {value || "-"}
        </Typography>
      </Box>
    </Tooltip>
  );

  return (
    <Box sx={{ padding: 3 }}>
      <Outlet />
      <Paper
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          padding: 3,
          mb: 4,
          gap: 3,
        }}
      >
        {/* ✅ Property Image */}
        {details?.main_image ? (
          <Box
            component="img"
            src={details.main_image}
            alt={`Image of ${property.address}`}
            sx={{
              maxHeight: { xs: "200px", md: "300px" },
              objectFit: "cover",
              borderRadius: 2,
              flex: 1,
            }}
          />
        ) : (
          <BrokenImageOutlined sx={{ fontSize: 60, color: "grey.600" }} />
        )}

        {/* ✅ Property Details */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {property.address}
          </Typography>

          {/* Property attributes with icons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              mb: 2,
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            <PropertyAttribute
              icon={<KingBed sx={{ color: "primary.main" }} />}
              value={details?.bedrooms}
              label="bedrooms"
            />
            <PropertyAttribute
              icon={<Bathtub sx={{ color: "primary.main" }} />}
              value={details?.bathrooms}
              label="bathrooms"
            />
            <PropertyAttribute
              icon={<DirectionsCar sx={{ color: "primary.main" }} />}
              value={details?.car_spaces}
              label="car spaces"
            />
            <PropertyAttribute
              icon={<SquareFoot sx={{ color: "primary.main" }} />}
              value={details?.land_area}
              label={details?.land_unit || "m²"}
            />
          </Stack>

          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            {details?.description}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={routeToEditProperty}
          >
            Edit Property Details
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Property;
