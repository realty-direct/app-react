import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { getGeocode, getLatLng } from "use-places-autocomplete";
import { useGoogleMaps } from "./GoogleMapsProvider";

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  disabled?: boolean;
  label?: string;
}

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
  const { isLoaded } = useGoogleMaps();
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<Prediction[]>([]);
  
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 2 || !isLoaded || !window.google?.maps?.places) {
      setOptions([]);
      return;
    }
    
    setLoading(true);
    
    try {
      if (!window.google.maps.places.AutocompleteSuggestion) {
        console.error("AutocompleteSuggestion API not available");
        return;
      }
      
      const autocompleteService = new window.google.maps.places.AutocompleteSuggestion();
      
      const response = await autocompleteService.getPlacePredictions({
        input: query,
        componentRestrictions: { country: "au" },
        types: ["address"],
      });
      
      setOptions(response.predictions as Prediction[] || []);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    
    const timeoutId = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handleSelect = async (address: string) => {
    if (!address) return;
    
    setInputValue(address);
    onChange(address);
    setOptions([]);
    
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      const placeDetails = results[0];
      
      const isAustralianAddress = placeDetails.address_components.some(component => 
        component.short_name === "AU" && component.types.includes("country")
      );
      
      if (!isAustralianAddress) {
        console.warn("Selected address is not in Australia");
        return;
      }
      
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
      getOptionLabel={(option) => 
        typeof option === "string" ? option : option.description
      }
      filterOptions={(x) => x}
      disabled={!isLoaded || disabled}
      renderOption={(props, option) => (
        <li {...props}>
          {option.structured_formatting ? (
            <div>
              <div style={{ fontWeight: 500 }}>
                {option.structured_formatting.main_text}
              </div>
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
                {loading && <CircularProgress color="inherit" size={20} />}
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