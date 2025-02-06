import { Alert, Box, Grid2, TextField, Typography } from "@mui/material";
import type { JSX } from "react";

interface PropertyDetailsProps {
  handlePropertyDetailsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  propertyDetails: { address: string };
}

export default function PropertyDetails({
  handlePropertyDetailsChange,
  propertyDetails,
}: PropertyDetailsProps): JSX.Element {
  return (
    <Grid2 container spacing={3} mt={3}>
      <Grid2 size={9}>
        <Typography variant="h6" gutterBottom justifySelf={"center"}>
          Enter Property Details
        </Typography>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Full Address"
            name="address"
            value={propertyDetails.address}
            onChange={handlePropertyDetailsChange}
            margin="normal"
          />

          {/* Map Placeholder */}
          <Box
            sx={{
              mt: 3,
              height: 300,
              bgcolor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
            }}
          >
            <Typography variant="body1">Map Placeholder</Typography>
          </Box>
        </Box>
      </Grid2>
      <Grid2 size={3} minHeight={"100%"}>
        <Alert severity="info" role="alert" sx={{ mb: 2 }}>
          <strong>Please remember:</strong>
          <br /> <br /> Realestate.com.au rules do not permit users to set the
          location of properties to a more popular nearby suburb/town. <br />
          <br />
          Please use the legal address as shown on your council rates.
        </Alert>

        <Alert severity="info" role="alert" sx={{ mb: 2 }}>
          <strong>Address Visibility:</strong> Not sure whether to show or hide
          your address? We recommend displaying it in most cases.
        </Alert>

        <Alert severity="info" role="alert" sx={{ mb: 2 }}>
          <strong>Need help?</strong> Get in touch with our team!
          <br /> 📞 INSERT
          <br /> 📱 INSERT
        </Alert>
      </Grid2>
    </Grid2>
  );
}
