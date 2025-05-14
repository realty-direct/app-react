// This file is kept for backwards compatibility
// We now use the GoogleMapsProvider component instead

// This is a deprecated utility - use GoogleMapsProvider instead
export const loadGoogleMapsScript = () => {
  console.warn('googleMapsLoader.ts is deprecated. Use GoogleMapsProvider instead.');
  return Promise.resolve();
};

// This is a deprecated utility - use GoogleMapsProvider instead
export const isGoogleMapsLoaded = (): boolean => {
  console.warn('isGoogleMapsLoaded is deprecated. Use useGoogleMaps hook instead.');
  return !!window.google?.maps;
};

// This is a deprecated utility - use GoogleMapsProvider instead
export const preloadGoogleMaps = (): Promise<void> => {
  console.warn('preloadGoogleMaps is deprecated. Use GoogleMapsProvider instead.');
  return Promise.resolve();
};

// TypeScript interface for global Google object
declare global {
  interface Window {
    google?: {
      maps: any;
    };
    [key: string]: any;
  }
}