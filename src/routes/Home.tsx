import { Add, BrokenImageOutlined, Delete } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { type JSX, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { deleteProperty } from "../database/property";
import useRealtyStore from "../store/store";

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const {
    properties,
    propertyDetails,
    profile,
    setProperties,
    deletePropertyDetail,
  } = useRealtyStore();

  // Local UI states
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [propertiesLoaded, setPropertiesLoaded] = useState(false);

  // Filter properties based on search query
  const filteredProperties = properties.filter((property) =>
    property.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Set properties as loaded after a short delay when the component mounts or profile changes
  useEffect(() => {
    if (profile?.id) {
      const timer = setTimeout(() => {
        setPropertiesLoaded(true);
      }, 1500); // Give time for properties to load
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [profile?.id]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id: string) => {
    setSelectedPropertyId(id);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedPropertyId(null);
  };

  // Delete the property after confirmation
  const handleDeleteConfirmed = async () => {
    if (!selectedPropertyId || !profile?.id) return;

    setIsDeleting(true);
    try {
      await deleteProperty(selectedPropertyId);

      // Update local store after successful deletion
      setProperties(properties.filter((p) => p.id !== selectedPropertyId));
      deletePropertyDetail(selectedPropertyId);
      handleCloseDeleteDialog();
    } catch (error) {
      console.error("❌ Error deleting property:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProperty = () => {
    navigate("/create");
  };

  // Show loading state if we have a profile but properties are still loading
  // Once propertiesLoaded is true, we'll show the empty state instead of loading
  const isInitialLoading = profile?.id && properties.length === 0 && !propertiesLoaded;

  return (
    <Box
      component="main"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
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
          sx={{ marginTop: { xs: 2, lg: 0 }, marginBottom: { xs: 2, lg: 0 } }}
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
        sx={{ mb: 4, width: "100%" }}
      />

      {/* Loading State for Properties */}
      {isInitialLoading ? (
        <LoadingSpinner text="Loading your properties..." />
      ) : filteredProperties.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          {searchQuery
            ? "No properties found matching your search."
            : "No properties found. Add your first property to get started."}
        </Typography>
      ) : (
        <Box sx={{ width: "100%" }}>
          {filteredProperties
            .sort(
              (a, b) =>
                new Date(b.created_at ?? "").getTime() -
                new Date(a.created_at ?? "").getTime()
            )
            .map((property) => {
              // Get property details
              const details = propertyDetails.find(
                (detail) => detail.property_id === property.id
              );
              const mainImage = details?.main_image;

              return (
                <Card
                  key={property.id}
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: 800 },
                    mx: "auto",
                    mb: 2,
                    boxShadow: 3,
                    borderRadius: 2,
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {mainImage ? (
                    <CardMedia
                      component="img"
                      sx={{
                        width: { xs: "100%", sm: 250 },
                        height: { xs: 160, sm: "auto" },
                        objectFit: "cover",
                        backgroundColor: "grey.200",
                      }}
                      image={mainImage}
                      alt={`Image of ${property.address}`}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: { xs: "100%", sm: 250 },
                        height: { xs: 160, sm: 200 },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "grey.100",
                      }}
                    >
                      <BrokenImageOutlined
                        sx={{
                          fontSize: 60,
                          color: "grey.600",
                        }}
                      />
                    </Box>
                  )}

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
                        {details?.property_category?.toUpperCase() ||
                          "UNKNOWN TYPE"}
                      </Typography>
                      {details?.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            display: "-webkit-box",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {details.description}
                        </Typography>
                      )}
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
                        onClick={() => handleOpenDeleteDialog(property.id)}
                      >
                        <Delete />
                      </Button>
                    </CardActions>
                  </Box>
                </Card>
              );
            })}
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={isDeleting ? undefined : handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Property?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this property? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            disabled={isDeleting}
            sx={{ minWidth: "75px" }}
          >
            {isDeleting ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
                <span>Deleting</span>
              </Box>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
