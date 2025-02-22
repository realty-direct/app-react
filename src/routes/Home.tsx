import { Add, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import { type JSX, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NoImageFound from "../assets/no_image_found.jpg";
import useRealtyStore from "../store/store";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const { properties, fetchProperties, user } = useRealtyStore(); // ✅ Zustand store
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch properties from Zustand store when component mounts
  useEffect(() => {
    // TODO: This should not fire every time Home is rendered. Should come from store. Store should be updated when user logs in and when changes to db are made.
    const loadProperties = async () => {
      if (user) await fetchProperties(user?.id); // Fetch from Supabase
      setLoading(false);
    };
    loadProperties();
  }, [fetchProperties, user]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // ✅ Filter properties based on search
  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteListing = (id: string) => {
    navigate(`/edit-listing/${id}`);
  };

  const handleAddProperty = () => {
    navigate("/create");
  };

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "100%",
        padding: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Properties
        </Typography>

        {/* Add Property Button */}
        <Button
          variant="contained"
          sx={{ marginTop: { xs: 2, lg: 0 }, marginBottom: { xs: 2, lg: 0 } }} // ✅ Responsive padding
          startIcon={<Add />}
          onClick={handleAddProperty}
        >
          Add Property
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 4, minWidth: "100%" }}
      />

      {/* Loading State */}
      {loading ? (
        <Typography variant="body1">Loading properties...</Typography>
      ) : filteredProperties.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No properties found.
        </Typography>
      ) : (
        <Grid2 container spacing={3} width="100%">
          {filteredProperties.map((property) => (
            <Card
              key={property.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" }, // ✅ Stacks on mobile, horizontal on desktop
                width: "100%",
                maxWidth: 800, // ✅ Keeps card from being too wide
                mx: "auto",
                mb: 2,
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {/* Property Image */}
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", sm: 250 }, // ✅ Full width on mobile, fixed size on desktop
                  height: { xs: 160, sm: "auto" }, // ✅ Prevents images from growing too large
                  objectFit: "contain",
                }}
                image={NoImageFound} // TODO: Add image support
                alt={property.address}
              />

              {/* Property Details */}
              <Box
                sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {property.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.property_type.toUpperCase()}
                  </Typography>
                </CardContent>

                <CardActions
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link to={`/property/${property.id}`}>
                    <Button size="small" color="primary">
                      Manage Property
                    </Button>
                  </Link>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteListing(property.id)}
                  >
                    <Delete />
                  </Button>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Grid2>
      )}
    </Box>
  );
}
