import { Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2"; // Import Grid2
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoImageFound from "../assets/no_image_found.jpg";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: Get this from the store
  const properties = [
    {
      id: 1,
      name: "UNIT 100/100 BROADWAY, BONBEACH, VIC 3196",
      type: "Residential",
      location: "Bonbeach, VIC 3196",
      image: null, // Image not available
    },
    {
      id: 2,
      name: "LEVEL 1, SUITE 1/1 HOBART PLACE, CITY, ACT 2601",
      type: "Residential",
      location: "City, ACT 2601",
      image: null, // Image not available
    },
    {
      id: 3,
      name: "15 KATHLEEN AVENUE, SOUTHPORT, QLD 4215",
      type: "Residential",
      location: "Southport, QLD 4215",
      image: null, // Image not available
    },
    {
      id: 4,
      name: "22 BAKER STREET, MELBOURNE, VIC 3000",
      type: "Commercial",
      location: "Melbourne, VIC 3000",
      image: null, // Image not available
    },
    {
      id: 5,
      name: "10 DOWNING STREET, LONDON, SW1A 2AA",
      type: "Residential",
      location: "London, SW1A 2AA",
      image: null, // Image not available
    },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredProperties = properties.filter((property) =>
    property.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManageProperty = (id: number) => {
    navigate(`/property/${id}`);
  };

  const handleEditListing = (id: number) => {
    navigate(`/edit-listing/${id}`);
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        backgroundColor: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "100%",
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
        Properties
      </Typography>

      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 4, minWidth: "100%" }}
      />

      <Grid container spacing={3} justifyContent="center" component="div">
        {filteredProperties.map((property) => (
          <Card
            key={property.id}
            sx={{
              display: "flex",
              mb: 2,
              width: "100%",
              flexDirection: { xs: "column", sm: "row" }, // Responsive for smaller screens
            }}
          >
            {/* First Column: Property Image */}
            <CardMedia
              component="img"
              sx={{
                width: { xs: "100%", sm: 160 }, // Full width on small screens, fixed width otherwise
                height: "100%",
                objectFit: "cover",
              }}
              image={property.image || NoImageFound}
              alt={property.name}
            />

            {/* Second Column: Content */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 2, // Padding around the content
              }}
            >
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {property.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Property type: {property.type}
                </Typography>
              </CardContent>
              <CardActions className={"justify-between"}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleManageProperty(property.id)}
                >
                  Manage Property
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleEditListing(property.id)}
                >
                  <Delete />
                </Button>
              </CardActions>
            </Box>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
