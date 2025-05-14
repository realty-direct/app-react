import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useGoogleMaps } from "./GoogleMapsProvider";

// Define the AddressAutocomplete props
interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  disabled?: boolean;
  label?: string;
}

// Define interface for Google Places prediction results
interface Prediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

const AddressAutocomplete = ({
  value,
  onChange,
  onLocationSelect,
  disabled = false,
  label = "Full Address",
}: AddressAutocompleteProps) => {
  // Get Google Maps loading state from context
  const { isLoaded } = useGoogleMaps();
  
  // Track the autocomplete service
  const autocompleteServiceRef = useRef<google.maps.places.AutocompletionRequest | null>(null);
  
  // State for suggestions and loading
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<Prediction[]>([]);
  
  // Set initial value when component mounts or value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  // Function to fetch address predictions using Places API
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2 || !isLoaded || !window.google?.maps?.places) {
      setOptions([]);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create AutocompleteSuggestion object
      if (!window.google.maps.places.AutocompleteSuggestion) {
        console.error("AutocompleteSuggestion API not available");
        return;
      }
      
      const autocompleteService = new window.google.maps.places.AutocompleteSuggestion();
      
      // Request predictions
      const response = await autocompleteService.getPlacePredictions({
        input: query,
        componentRestrictions: { country: "au" },  // Restrict to Australia only
        types: ["address"],  // Only return addresses, not business names or points of interest
      });
      
      const predictions = response.predictions || [];
      setOptions(predictions as Prediction[]);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to handle input change with debounce
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    
    // Use setTimeout to debounce API calls
    const timeoutId = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  // Handle address selection
  const handleSelect = async (address: string) => {
    if (!address) return;
    
    setInputValue(address);
    onChange(address);
    setOptions([]);
    
    try {
      // Convert address to geocode and get lat/lng
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Get the place details from the first response
      const placeDetails = results[0];
      
      // Check if the address is in Australia - verify in the address_components
      const isAustralianAddress = placeDetails.address_components.some(component => 
        component.short_name === "AU" && component.types.includes("country")
      );
      
      if (!isAustralianAddress) {
        console.warn("Selected address is not in Australia");
        return;
      }
      
      // Call onLocationSelect callback if provided
      if (onLocationSelect) {
        onLocationSelect({ lat, lng });
      }
    } catch (error) {
      console.error("Error geocoding selected address:", error);
    }
  };

  return (
    <Autocomplete
      freeSolo
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(_, newValue) => handleInputChange(newValue)}
      onChange={(_, newValue) => {
        if (newValue) {
          const address = typeof newValue === "string" 
            ? newValue 
            : newValue.description;
          handleSelect(address);
        }
      }}
      getOptionLabel={(option) => {
        return typeof option === "string" ? option : option.description;
      }}
      filterOptions={(x) => x} // Don't filter options, Google Places API already does that
      disabled={!isLoaded || disabled}
      renderOption={(props, option) => (
        <li {...props}>
          {option.structured_formatting ? (
            <div>
              <div style={{ fontWeight: 500 }}>{option.structured_formatting.main_text}</div>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {option.structured_formatting.secondary_text}
              </div>
            </div>
          ) : (
            option.description
          )}
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          fullWidth
          disabled={!isLoaded || disabled}
          placeholder="Start typing an Australian address..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AddressAutocomplete;