import { useLoadScript } from '@react-google-maps/api';
import { Alert, Snackbar } from '@mui/material';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

// Define the libraries we want to load (with proper types)
const libraries: ["places"] = ['places'];

// Create a context to share Google Maps loading state
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

// Hook to use the Google Maps context
export const useGoogleMaps = () => useContext(GoogleMapsContext);

interface GoogleMapsProviderProps {
  children: ReactNode;
  apiKey?: string;
}

export const GoogleMapsProvider = ({ 
  children, 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string 
}: GoogleMapsProviderProps) => {
  // State for API key from environment if not provided
  const [key, setKey] = useState<string | undefined>(apiKey);
  // State for error notification
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Use the useLoadScript hook from @react-google-maps/api to load the script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: key || '',
    libraries: libraries,
    // Additional options to ensure full functionality
    version: 'weekly', // Use latest weekly version
  });

  // Use environment variable for API key if not provided
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

  // Handle loading errors
  useEffect(() => {
    if (loadError) {
      const message = `Error loading Google Maps API: ${loadError.message}`;
      console.error(message, loadError);
      setErrorMessage(message);
      setShowError(true);
    }
  }, [loadError]);
  
  // Function to close error notification
  const handleCloseError = () => setShowError(false);

  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError, apiKey: key }}>
      {/* Render children */}
      {children}
      
      {/* Error notification */}
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