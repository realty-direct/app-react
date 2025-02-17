import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Create(): JSX.Element {
  const [propertyDetails, setPropertyDetails] = useState({
    address: "",
    propertyType: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyDetails({ ...propertyDetails, [e.target.name]: e.target.value });
  };

  const handleContinue = () => {
    // ✅ Insert form submission logic here
    console.log("Property Details Submitted: ", propertyDetails);
    navigate("/"); // Redirect to homepage after submission
  };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Property Details
      </Typography>

      <Grid2 container spacing={3} mt={3}>
        <Grid2 size={9}>
          <Typography variant="h6" gutterBottom>
            Enter Property Details
          </Typography>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            {/* Address Input */}
            <TextField
              fullWidth
              label="Full Address"
              name="address"
              value={propertyDetails.address}
              onChange={handleInputChange}
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

            {/* Property Type Selection */}
            <Typography variant="h6" sx={{ mt: 4 }}>
              What type of property are you looking to list?
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <RadioGroup
                row
                name="propertyType"
                value={propertyDetails.propertyType}
                onChange={handleInputChange}
              >
                <FormControlLabel
                  value="residential"
                  control={<Radio />}
                  label="Residential"
                />
                <FormControlLabel
                  value="commercial"
                  control={<Radio />}
                  label="Commercial"
                />
                <FormControlLabel
                  value="rural"
                  control={<Radio />}
                  label="Rural"
                />
                <FormControlLabel
                  value="land"
                  control={<Radio />}
                  label="Land"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </Grid2>

        {/* Info Alerts */}
        <Grid2 size={3} minHeight={"100%"}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Please remember:</strong>
            <br /> <br /> Realestate.com.au rules do not permit users to set the
            location of properties to a more popular nearby suburb/town.
            <br />
            <br />
            Please use the legal address as shown on your council rates.
          </Alert>

          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Address Visibility:</strong> Not sure whether to show or
            hide your address? We recommend displaying it in most cases.
          </Alert>

          <Alert severity="info" sx={{ mb: 2 }}>
            <strong>Need help?</strong> Get in touch with our team!
            <br /> 📞 INSERT
            <br /> 📱 INSERT
          </Alert>
        </Grid2>
      </Grid2>

      {/* Navigation Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate("/")}
        >
          Back
        </Button>
        <Button variant="contained" onClick={handleContinue}>
          Continue
        </Button>
      </Box>
    </Box>
  );
}
