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
import { type JSX, useState } from "react";
import { Link, useNavigate } from "react-router";
import useRealtyStore from "../store/store";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const { properties, propertyDetails } = useRealtyStore(); // ✅ Zustand store
  const [searchQuery, setSearchQuery] = useState("");

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

      {filteredProperties.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No properties found.
        </Typography>
      ) : (
        <Grid2 container spacing={3} width="100%">
          {filteredProperties
            .sort(
              (a, b) =>
                new Date(b.created_at ?? "").getTime() -
                new Date(a.created_at ?? "").getTime()
            )
            .map((property) => (
              <Card
                key={property.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  width: "100%",
                  maxWidth: 800,
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
                    width: { xs: "100%", sm: 250 },
                    height: { xs: 160, sm: "auto" },
                    objectFit: "contain",
                  }}
                  // image={NoImageFound}
                  alt={property.address}
                />

                {/* Property Details */}
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {property.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {propertyDetails
                        .find((detail) => detail.property_id === property.id)
                        ?.property_type?.toUpperCase() || "UNKNOWN TYPE"}
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
