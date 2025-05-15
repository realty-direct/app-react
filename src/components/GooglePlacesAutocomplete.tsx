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

interface GooglePlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  onValidSelection?: (isValid: boolean) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  countryRestriction?: string;
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  onLocationSelect,
  onValidSelection,
  disabled = false,
  label = 'Address',
  placeholder = 'Start typing an address...',
  countryRestriction = 'au'
}: GooglePlacesAutocompleteProps) {
  const { isLoaded } = useGoogleMaps();
  const [inputValue, setInputValue] = useState(value);
  const [options, setOptions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PlacePrediction | null>(null);
  const autocompleteServiceRef = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  useEffect(() => {
    if (isLoaded && window.google?.maps) {
      try {
        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        geocoderRef.current = new window.google.maps.Geocoder();
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
      } catch (error) {
        console.error('Error initializing Google Places services:', error);
      }
    }
  }, [isLoaded]);

  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  const getPlacePredictions = useCallback(async (input: string) => {
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
            console.warn('Autocomplete prediction error:', status);
            setOptions([]);
            return;
          }

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
  }, [countryRestriction]);

  useEffect(() => {
    const timer = setTimeout(() => {
      getPlacePredictions(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, getPlacePredictions]);

  const getPlaceDetails = async (placeId: string) => {
    if (!geocoderRef.current) {
      console.error('Geocoder not initialized');
      return;
    }

    try {
      geocoderRef.current.geocode({ placeId }, (results, status) => {
        if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) {
          console.error('Geocoding failed:', status);
          return;
        }

        const location = results[0].geometry.location;
        
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
        
        const coordinates = { lat: location.lat(), lng: location.lng() };
        
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
      value={value}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        
        if (selectedPrediction && newInputValue !== selectedPrediction.description) {
          setSelectedPrediction(null);
          onValidSelection?.(false);
        }
        
        onChange(newInputValue);
      }}
      onChange={(_, option) => {
        if (option) {
          if (typeof option !== 'string') {
            const selectedAddress = option.description;
            setSelectedPrediction(option);
            setInputValue(selectedAddress);
            onChange(selectedAddress);
            onValidSelection?.(true);
            getPlaceDetails(option.place_id);
            
            if (window.google?.maps?.places) {
              sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
            }
          } else {
            setSelectedPrediction(null);
            onChange(option);
            onValidSelection?.(false);
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