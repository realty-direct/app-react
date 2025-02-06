import {
  Alert,
  FormControl,
  FormControlLabel,
  Grid2,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { type JSX, useState } from "react";

export default function AdditionalInfo(): JSX.Element {
  const [listingType, setListingType] = useState("");
  const [propertyType, setPropertyType] = useState("");
  return (
    <Grid2 container spacing={3} mt={3}>
      <Grid2 size={9}>
        <Typography variant="h6" gutterBottom justifySelf={"center"}>
          How would you like to list your property?
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="listingType"
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
          >
            <FormControlLabel value="sale" control={<Radio />} label="Sale" />
            <FormControlLabel value="rent" control={<Radio />} label="Rent" />
          </RadioGroup>
        </FormControl>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ mt: 3 }}
          justifySelf={"center"}
        >
          What type of property are you looking to list?
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            row
            name="propertyType"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
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
            <FormControlLabel value="rural" control={<Radio />} label="Rural" />
            <FormControlLabel value="land" control={<Radio />} label="Land" />
          </RadioGroup>
        </FormControl>
      </Grid2>
      <Grid2 size={3} minHeight={"100%"}>
        <Alert severity="info" role="alert" sx={{ mb: 2 }}>
          <strong>Need help?</strong> Get in touch with our team!
          <br /> 📞 INSERT
          <br /> 📱 INSERT
        </Alert>
      </Grid2>
    </Grid2>
  );
}
