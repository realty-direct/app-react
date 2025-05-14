# Google Maps Integration Setup

This application uses Google Maps for address autocomplete and location visualization. To use these features, you need to set up a Google Maps API key.

## Setup Instructions

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Navigate to "APIs & Services" > "Dashboard"
4. Click on "+ ENABLE APIS AND SERVICES"
5. Search for and enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

## Obtaining an API Key

1. In the Google Cloud Console, navigate to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the newly created API key
4. Optional but recommended: Restrict the key to only the APIs mentioned above for security

## Environment Configuration

1. Create a `.env` file in the root directory of the project (or edit existing)
2. Add the following line, replacing `YOUR_API_KEY` with your actual API key:

```
VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
```

3. Restart the development server to apply the changes

## Billing Information

Google Maps Platform requires a billing account with a valid credit card. However, Google provides a $200 monthly credit, which is usually sufficient for development and small applications.

## Australia-Only Restrictions

Our implementation restricts address searches to Australia only. To modify this behavior:

1. Open `/src/components/AddressAutocomplete.tsx`
2. Look for the `componentRestrictions: { country: "au" }` code
3. Remove or modify this restriction as needed

## Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/overview)