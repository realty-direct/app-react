import { 
  Autocomplete, 
  Box, 
  CircularProgress, 
  TextField, 
  Typography 
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useGoogleMaps } from './GoogleMapsProvider';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

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
  countryRestriction = 'au'
}: SimpleAddressAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
      geocoderRef.current = new window.google.maps.Geocoder();
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  }, [isLoaded]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const fetchPredictions = useCallback(async (input: string) => {
    if (!input || input.length < 2 || !autocompleteServiceRef.current) {
      setOptions([]);
      return;
    }

    setLoading(true);

    try {
      const request: google.maps.places.AutocompletionRequest = {
        input,
        sessionToken: sessionTokenRef.current || undefined,
        types: ['address'],
      };

      if (countryRestriction) {
        request.componentRestrictions = { country: countryRestriction };
      }

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
  }, [countryRestriction]);

  const getGeocode = useCallback((placeId: string) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ placeId }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) {
        console.warn('Geocoding failed:', status);
        return;
      }

      const location = results[0].geometry.location;
      const coordinates = {
        lat: location.lat(),
        lng: location.lng()
      };
      
      onLocationSelect?.(coordinates);
      onValidSelection?.(true);
      
      if (window.google?.maps?.places) {
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      }
    });
  }, [onLocationSelect, onValidSelection]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        fetchPredictions(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, value, fetchPredictions]);

  return (
    <Autocomplete
      fullWidth
      freeSolo
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      disabled={!isLoaded || disabled}
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newValue) => {
        setInputValue(newValue);
        
        if (onValidSelection && newValue !== value) {
          onValidSelection(false);
        }
      }}
      onChange={(_, option) => {
        if (!option) return;
        
        if (typeof option === 'string') {
          onChange(option);
        } else {
          const address = option.description;
          onChange(address);
          setInputValue(address);
          getGeocode(option.place_id);
        }
      }}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : option.description
      }
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
          fullWidth
          disabled={!isLoaded || disabled}
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
}