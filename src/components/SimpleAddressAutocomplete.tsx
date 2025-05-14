import { 
  Autocomplete, 
  Box, 
  CircularProgress, 
  TextField, 
  Typography 
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';

// Interface for a place prediction
interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// Component props
interface SimpleAddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  onValidSelection?: (isValid: boolean) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  countryRestriction?: string;
}

export default function SimpleAddressAutocomplete({
  value,
  onChange,
  onLocationSelect,
  onValidSelection,
  disabled = false,
  label = 'Address',
  placeholder = 'Start typing an address...',
  countryRestriction = 'au' // Default to Australia
}: SimpleAddressAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  // Refs for Google services
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize services when Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  // Update input value when prop value changes (external control)
  useEffect(() => {
    console.log('Value prop changed to:', value);
    setInputValue(value);
  }, [value]);

  // Function to fetch address predictions
  const fetchPredictions = async (input: string) => {
    if (!input || input.length < 2 || !autocompleteServiceRef.current) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      // Create request with country restriction
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionTokenRef.current || undefined,
        types: ['address'],
      };

      if (countryRestriction) {
        request.componentRestrictions = { country: countryRestriction };
      }

      // Get predictions
      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setLoading(false);

          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setOptions([]);
            return;
          }

          setOptions(predictions);
        }
      );
    } catch (error) {
      console.error('Error getting place predictions:', error);
      setLoading(false);
      setOptions([]);
    }
  };

  // Handle geocoding of a selected place
  const getGeocode = (placeId: string) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { placeId },
      (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) {
          console.warn('Geocoding failed:', status);
          return;
        }

        const location = results[0].geometry.location;
        
        // Create coordinates object
        const coordinates = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        // Call location select callback
        if (onLocationSelect) {
          onLocationSelect(coordinates);
        }
        
        // Signal that we have a valid selection
        if (onValidSelection) {
          onValidSelection(true);
        }
        
        // Create a new session token after selection
        if (window.google?.maps?.places) {
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        }
      }
    );
  };

  // Debounce input for predictions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        fetchPredictions(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, value]);

  return (
    <Autocomplete
      fullWidth
      freeSolo
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      disabled={!isLoaded || disabled}
      
      // This is the value shown when an option is selected
      value={value}
      
      // This is what's in the input field during typing
      inputValue={inputValue}
      
      // Handle input text changes (typing)
      onInputChange={(_, newValue) => {
        setInputValue(newValue);
        
        // When typing, mark this as not a valid selection
        if (onValidSelection && newValue !== value) {
          onValidSelection(false);
        }
      }}
      
      // Handle option selection
      onChange={(_, option) => {
        if (!option) return;
        
        if (typeof option === 'string') {
          // Manual text entry (not selecting from dropdown)
          onChange(option);
          console.log('String option selected:', option);
        } else {
          // Selected from dropdown
          const address = option.description;
          onChange(address);
          // Also update the input value to match
          setInputValue(address);
          console.log('Dropdown option selected:', address);
          getGeocode(option.place_id);
        }
      }}
      
      // How to get the label for each option
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.description;
      }}
      
      // How to render each option in the dropdown
      renderOption={(props, option) => (
        <li {...props}>
          {option.structured_formatting ? (
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {option.structured_formatting.main_text}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {option.structured_formatting.secondary_text}
              </Typography>
            </Box>
          ) : (
            option.description
          )}
        </li>
      )}
      
      // How to render the input
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          fullWidth
          disabled={!isLoaded || disabled}
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
}