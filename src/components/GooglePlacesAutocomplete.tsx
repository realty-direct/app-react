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
  main_text?: string;
  secondary_text?: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

// Component props
interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  onValidSelection?: (isValid: boolean) => void; // Callback to notify when a valid address is selected
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  countryRestriction?: string;
}

// Direct Google Maps autocomplete integration
export default function GooglePlacesAutocomplete({
  value,
  onChange,
  onLocationSelect,
  onValidSelection,
  disabled = false,
  label = 'Address',
  placeholder = 'Start typing an address...',
  countryRestriction = 'au' // Default to Australia
}: GooglePlacesAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PlacePrediction | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google services when Maps API is loaded
  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      try {
        // Initialize autocomplete service
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        
        // Initialize geocoder
        geocoderRef.current = new window.google.maps.Geocoder();
        
        // Create a new session token (helps with billing)
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      } catch (error) {
        console.error('Error initializing Google Places services:', error);
      }
    }
  }, [isLoaded]);

  // Update local input value when prop value changes
  useEffect(() => {
    // Only update the input value if it's different from what we're showing
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Function to get place predictions
  const getPlacePredictions = async (input: string) => {
    if (!input || input.length < 2 || !autocompleteServiceRef.current) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      // Create request with bias toward Australia
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionTokenRef.current || undefined,
        types: ['address'],
      };

      // Add country restriction if specified
      if (countryRestriction) {
        request.componentRestrictions = { country: countryRestriction };
      }

      // Get predictions
      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setLoading(false);

          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            console.warn('Autocomplete prediction error:', status);
            setOptions([]);
            return;
          }

          // Format predictions to include structured formatting
          const formattedPredictions = predictions.map(prediction => ({
            place_id: prediction.place_id,
            description: prediction.description,
            structured_formatting: prediction.structured_formatting
          }));

          setOptions(formattedPredictions);
        }
      );
    } catch (error) {
      console.error('Error getting place predictions:', error);
      setLoading(false);
      setOptions([]);
    }
  };

  // Debounce the input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      getPlacePredictions(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Handle location selection
  const getPlaceDetails = async (placeId: string) => {
    if (!geocoderRef.current) {
      console.error('Geocoder not initialized');
      return;
    }

    try {
      // Use geocoder to get details for the selected place
      geocoderRef.current.geocode({ placeId }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results || results.length === 0) {
          console.error('Geocoding failed:', status);
          return;
        }

        const location = results[0].geometry.location;
        
        // Verify the result is in the correct country if restriction is applied
        if (countryRestriction) {
          const countryComponent = results[0].address_components.find(
            component => component.types.includes('country')
          );
          
          if (!countryComponent || 
              countryComponent.short_name.toLowerCase() !== countryRestriction.toLowerCase()) {
            console.warn('Selected location is not in the restricted country');
            return;
          }
        }
        
        // Extract lat/lng values
        const coordinates = {
          lat: location.lat(),
          lng: location.lng()
        };
        
        console.log('Geocoded coordinates:', coordinates);
        
        // Call the location select callback with lat/lng
        if (onLocationSelect) {
          onLocationSelect(coordinates);
        }
      });
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  };

  return (
    <Autocomplete
      id="google-places-autocomplete"
      freeSolo
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      disabled={!isLoaded || disabled}
      value={value} // This is used for the selected value
      inputValue={inputValue} // This is what's shown in the input field
      onInputChange={(_, newInputValue) => {
        console.log('Input changed to:', newInputValue);
        setInputValue(newInputValue);
        
        // If the user is typing, this is not a valid selection yet
        if (selectedPrediction && newInputValue !== selectedPrediction.description) {
          setSelectedPrediction(null);
          
          if (onValidSelection) {
            onValidSelection(false);
          }
        }
        
        // Always inform parent of typing changes
        onChange(newInputValue);
      }}
      onChange={(_, option) => {
        // Handle selection
        if (option) {
          if (typeof option !== 'string') {
            // It's a place prediction object
            const selectedAddress = option.description;
            
            // Store the selected prediction
            setSelectedPrediction(option);
            
            // Update the input field and parent component
            setInputValue(selectedAddress);
            onChange(selectedAddress);
            
            // Notify parent that a valid address was selected
            if (onValidSelection) {
              onValidSelection(true);
            }
            
            // Get coordinates and call onLocationSelect
            getPlaceDetails(option.place_id);
            
            // Create a new session token after selection
            if (window.google?.maps?.places) {
              sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
            }
          } else {
            // It's a string (manual entry)
            setSelectedPrediction(null);
            onChange(option);
            
            // Notify parent that this is not a valid selection
            if (onValidSelection) {
              onValidSelection(false);
            }
          }
        }
      }}
      getOptionLabel={(option) => {
        if (typeof option === 'string') return option;
        return option.description || '';
      }}
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
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          variant="outlined"
          disabled={!isLoaded || disabled}
          // Don't override the input value here, let Autocomplete handle it
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