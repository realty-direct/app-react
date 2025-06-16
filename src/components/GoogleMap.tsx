import { Box, CircularProgress, Typography } from "@mui/material";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useMemo } from "react";
import type { Location } from "../utils/locationUtils";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface GoogleMapProps {
  location?: Location;
  zoom?: number;
  height?: string | number;
  width?: string | number;
  apiKey?: string;
}

const DEFAULT_CENTER = { lat: -25.2744, lng: 133.7751 };
const DEFAULT_ZOOM = 4;

const GoogleMap = ({
  location,
  zoom = 16,
  height = 250,
  width = "100%",
  apiKey,
}: GoogleMapProps) => {
  const { isLoaded, loadError, apiKey: contextApiKey } = useGoogleMaps();
  const mapApiKey = apiKey || contextApiKey;
  const center = useMemo(() => location || DEFAULT_CENTER, [location]);
  const zoomLevel = useMemo(() => location ? zoom : DEFAULT_ZOOM, [location, zoom]);

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
          center={center}
          zoom={zoomLevel}
          mapId="property-map"
          gestureHandling="cooperative"
          style={{ width: "100%", height: "100%" }}
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