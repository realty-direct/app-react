import React, { useEffect, useRef, useState } from 'react';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { useGoogleMaps } from './GoogleMapsProvider';

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
  
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const geocoder = useRef<google.maps.Geocoder | null>(null);
  
  useEffect(() => {
    if (!isLoaded || !window.google?.maps) return;
    
    try {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoder.current = new window.google.maps.Geocoder();
    } catch (error) {
      // Error handled silently
    }
  }, [isLoaded]);
  
  useEffect(() => {
    setInputValue(address || '');
  }, [address]);
  
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
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue) {
        fetchSuggestions(inputValue);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [inputValue]);
  
  const getPlaceCoordinates = (placeId: string, address: string) => {
    if (!geocoder.current) return;
    
    geocoder.current.geocode({ placeId }, (results, status) => {
      if (status !== google.maps.GeocoderStatus.OK || !results?.[0]) return;
      
      const location = results[0].geometry.location;
      const coordinates = {
        lat: location.lat(),
        lng: location.lng()
      };
      
      onAddressSelected(address, coordinates);
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
        
        if (reason !== 'reset' && reason !== 'clear') {
          onAddressChange(newInputValue);
        }
      }}
      onChange={(_, option) => {
        if (!option) return;
        
        if (typeof option === 'string') {
          onAddressChange(option);
          return;
        }
        
        const selectedAddress = option.description;
        onAddressChange(selectedAddress);
        
        if (!usedOptions[option.place_id]) {
          getPlaceCoordinates(option.place_id, selectedAddress);
        }
      }}
      getOptionLabel={(option) => 
        typeof option === 'string' ? option : option.description
      }
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