import { Box, Button, Paper, Typography } from "@mui/material";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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
        <Box
          component="img"
          // src={property.imageUrl || NoImageFound}
          alt={`Image of ${property.address}`}
          sx={{
            maxHeight: { xs: "200px", md: "300px" },
            objectFit: "cover",
            borderRadius: 2,
            flex: 1,
          }}
        />

        {/* ✅ Property Details */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {property.address}
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
            {details?.property_type}
          </Typography>
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
