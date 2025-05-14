import React, { useEffect, useRef, useState } from 'react';
import { 
  Autocomplete, 
  CircularProgress, 
  TextField 
} from '@mui/material';
import { useGoogleMaps } from './GoogleMapsProvider';

// Interface for Google Places prediction items
interface AddressPrediction {
  place_id: string;
  description: string;
}

interface BasicAddressSearchProps {
  address: string;
  onAddressChange: (address: string) => void;
  onAddressSelected: (address: string, location: {lat: number, lng: number}) => void;
  disabled?: boolean;
}

export default function BasicAddressSearch({
  address,
  onAddressChange,
  onAddressSelected,
  disabled = false
}: BasicAddressSearchProps) {
  const { isLoaded } = useGoogleMaps();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<AddressPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [usedOptions, setUsedOptions] = useState<{[key: string]: boolean}>({});
  
  // Reference to Google services
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  
  // Initialize services when the map loads
  useEffect(() => {
    if (!isLoaded || !window.google?.maps) return;
    
    try {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    } catch (error) {
      // Error is handled without console log for performance
    }
  }, [isLoaded]);
  
  // Track the user's input for address autocomplete
  useEffect(() => {
    setInputValue(address || '');
  }, [address]);
  
  // Fetch address suggestions when user types
  const fetchSuggestions = async (input: string) => {
    if (!input || input.length < 2 || !autocompleteService.current) {
      setOptions([]);
      return;
    }
    
    setLoading(true);
    
    try {
      autocompleteService.current.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: 'au' },
          types: ['address']
        },
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
      // Handle error without console log
      setLoading(false);
    }
  };
  
  // Fetch suggestions when input changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        fetchSuggestions(inputValue);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue]);
  
  // Handle getting coordinates for a selected place
  const getPlaceCoordinates = (placeId: string, address: string) => {
    if (!geocoder.current) return;
    
    geocoder.current.geocode({ placeId }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results || !results[0]) {
        // Handle geocoding failure silently
        return;
      }
      
      const location = results[0].geometry.location;
      const coordinates = {
        lat: location.lat(),
        lng: location.lng()
      };
      
      // Call parent callback with address and coordinates
      onAddressSelected(address, coordinates);
      
      // Mark this option as used
      setUsedOptions(prev => ({...prev, [placeId]: true}));
    });
  };
  
  return (
    <Autocomplete
      id="address-search"
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      freeSolo
      loading={loading}
      disabled={disabled || !isLoaded}
      value={address}
      inputValue={inputValue}
      onInputChange={(_, newInputValue, reason) => {
        setInputValue(newInputValue);
        
        // Don't update parent on reset or clear
        if (reason !== 'reset' && reason !== 'clear') {
          onAddressChange(newInputValue);
        }
      }}
      onChange={(_, option) => {
        if (!option) return;
        
        // Handle string options (manual input)
        if (typeof option === 'string') {
          onAddressChange(option);
          return;
        }
        
        // Handle selection from dropdown
        const selectedAddress = option.description;
        onAddressChange(selectedAddress);
        
        // Get coordinates if we haven't used this option before
        if (!usedOptions[option.place_id]) {
          getPlaceCoordinates(option.place_id, selectedAddress);
        }
      }}
      getOptionLabel={(option) => {
        // Handle string options
        if (typeof option === 'string') return option;
        
        // Handle prediction objects
        return option.description;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Property Address"
          placeholder="Start typing an address..."
          fullWidth
          variant="outlined"
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