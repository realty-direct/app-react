import { Box, CircularProgress, Typography } from "@mui/material";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useMemo } from "react";
import type { Location } from "../utils/locationUtils";
import { useGoogleMaps } from "./GoogleMapsProvider";

// Define the GoogleMap component props
interface GoogleMapProps {
  location?: Location;
  zoom?: number;
  height?: string | number;
  width?: string | number;
  apiKey?: string;
}

// Default map center (Australia)
const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };
const DEFAULT_ZOOM = 4;
const DEFAULT_AUSTRALIA_BOUNDS = {
  north: -10.6681857235, // Northern tip of Australia
  south: -43.6345972634, // Southern tip of Tasmania
  west: 112.9511178909, // Western edge of Australia
  east: 153.6394677328, // Eastern edge of Australia
};

const GoogleMap = ({
  location,
  zoom = 16,
  height = 250,
  width = "100%",
  apiKey,
}: GoogleMapProps) => {
  // Get Google Maps loading state from context
  const { isLoaded, loadError, apiKey: contextApiKey } = useGoogleMaps();
  
  // Use API key from props or context
  const mapApiKey = apiKey || contextApiKey;

  // Center map on location or default to Australia
  const center = useMemo(() => {
    return location || DEFAULT_CENTER;
  }, [location]);

  // Dynamic zoom level - closer if location is specified
  const zoomLevel = useMemo(() => {
    return location ? zoom : DEFAULT_ZOOM;
  }, [location, zoom]);

  // Show loading state
  if (!isLoaded) {
    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.200",
          borderRadius: 1,
        }}
      >
        <CircularProgress size={24} sx={{ mr: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Map loading...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (loadError) {
    return (
      <Box
        sx={{
          height,
          width,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.200",
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="error">
          Error loading map. Please check your API key.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height, width, borderRadius: 1, overflow: "hidden" }}>
      <APIProvider apiKey={mapApiKey || ''}>
        <Map
          center={center} /* Use center instead of defaultCenter to update when location changes */
          zoom={zoomLevel} /* Use zoom instead of defaultZoom to update when zoom changes */
          mapId="property-map"
          gestureHandling="cooperative"
          style={{ width: "100%", height: "100%" }}
          defaultRestriction={{
            latLngBounds: DEFAULT_AUSTRALIA_BOUNDS,
            strictBounds: false // Allow panning outside but with resistance
          }}
        >
          {location && (
            <Marker 
              position={location} 
              title="Selected location" 
            />
          )}
        </Map>
      </APIProvider>
    </Box>
  );
};

export default GoogleMap;