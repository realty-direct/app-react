/**
 * Location utilities for handling property geo-coordinates
 */

// Define standard location interface
export interface Location {
  lat: number;
  lng: number;
}

/**
 * Extract location data from property description
 * Property descriptions can contain location data in the format:
 * "Location: {lat},{lng}\n"
 */
export const extractLocationFromDescription = (description: string | null): Location | null => {
  if (!description) return null;
  
  // Try to extract location from description field pattern
  const locationMatch = description.match(/Location: (-?\d+\.?\d*),(-?\d+\.?\d*)/);
  
  if (locationMatch && locationMatch.length === 3) {
    const lat = parseFloat(locationMatch[1]);
    const lng = parseFloat(locationMatch[2]);
    
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  
  return null;
};

/**
 * Format location data for storing in description field
 */
export const formatLocationForDescription = (location: Location | null, existingDescription: string | null): string => {
  // Remove any existing location data
  const cleanDescription = existingDescription 
    ? existingDescription.replace(/Location: -?\d+\.?\d*,-?\d+\.?\d*\n?/, '')
    : '';
    
  // If no location, just return the cleaned description
  if (!location) return cleanDescription;
  
  // Add location data at the beginning
  return `Location: ${location.lat},${location.lng}\n${cleanDescription}`;
};

/**
 * Get a static Google Maps URL for a location
 */
export const getStaticMapUrl = (
  location: Location, 
  apiKey: string | undefined,
  width = 400, 
  height = 300, 
  zoom = 15
): string => {
  if (!location || !apiKey) return '';
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${location.lat},${location.lng}&key=${apiKey}`;
};