import { useLoadScript } from '@react-google-maps/api';
import { Alert, Snackbar } from '@mui/material';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const libraries: ["places"] = ['places'];

interface GoogleMapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
  apiKey: string | undefined;
}

const GoogleMapsContext = createContext<GoogleMapsContextType>({
  isLoaded: false,
  loadError: undefined,
  apiKey: undefined,
});

export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export const GoogleMapsProvider = ({ 
  children, 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string 
}: GoogleMapsProviderProps) => {
  const [key, setKey] = useState<string | undefined>(apiKey);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key || '',
    libraries: libraries,
    version: 'weekly',
  });

  useEffect(() => {
    if (!key) {
      const envApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (envApiKey) {
        setKey(envApiKey as string);
      } else {
        const message = 'Google Maps API key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file';
        console.error(message);
        setErrorMessage(message);
        setShowError(true);
      }
    }
  }, [key]);

  useEffect(() => {
    if (loadError) {
      const message = `Error loading Google Maps API: ${loadError.message}`;
      console.error(message, loadError);
      setErrorMessage(message);
      setShowError(true);
    }
  }, [loadError]);
  
  const handleCloseError = () => setShowError(false);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey: key }}>
      {children}
      
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </GoogleMapsContext.Provider>
  );
};

export default GoogleMapsProvider;