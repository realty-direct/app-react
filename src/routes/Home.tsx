import { Delete } from "@mui/icons-material";
import Add from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoImageFound from "../assets/no_image_found.jpg";
import useStore from "../store/store";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const store = useStore();

  const clearSelectedProperty = useStore(
    (state) => state.clearSelectedProperty
  );

  // Everytime the Home screen mounts, clear the selected property.
  useEffect(() => {
    clearSelectedProperty();
  }, [clearSelectedProperty]); // Only run once when the component mounts

  // TODO: Get this from the store
  const properties = [
    {
      id: "1",
      name: "UNIT 100/100 BROADWAY, BONBEACH, VIC 3196",
      type: "Residential",
      location: "Bonbeach, VIC 3196",
      image: null, // Image not available
    },
    {
      id: "2",
      name: "LEVEL 1, SUITE 1/1 HOBART PLACE, CITY, ACT 2601",
      type: "Residential",
      location: "City, ACT 2601",
      image: null, // Image not available
    },
    {
      id: "3",
      name: "15 KATHLEEN AVENUE, SOUTHPORT, QLD 4215",
      type: "Residential",
      location: "Southport, QLD 4215",
      image: null, // Image not available
    },
    {
      id: "4",
      name: "22 BAKER STREET, MELBOURNE, VIC 3000",
      type: "Commercial",
      location: "Melbourne, VIC 3000",
      image: null, // Image not available
    },
    {
      id: "5",
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

  const handleManageProperty = (id: string) => {
    store.setSelectedProperty(id);
    navigate(`/property/${id}`);
  };

  const handleEditListing = (id: string) => {
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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Properties
        </Typography>

        {/* Add Property Button */}
        <Button
          variant="contained"
          sx={{
            padding: 2,
          }}
          startIcon={<Add />}
          onClick={() => handleAddProperty()} // Replace with your navigation or add property logic
        >
          Add Property
        </Button>
      </Box>
      <TextField
        label="Search..."
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 4, minWidth: "100%" }}
      />

      <Grid
        container
        width={"100%"}
        spacing={3}
        justifyContent="center"
        component="div"
      >
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
