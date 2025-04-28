import {
  Box,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  // Use property details directly from store for initial values
  const name = propertyDetail?.contact_name || "";
  const email = propertyDetail?.contact_email || "";
  const phone = propertyDetail?.contact_phone || "";
  const [useFullEnquirySystem, setUseFullEnquirySystem] = useState(false);

  // Validation function for email
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Direct update handlers - no local state needed for form fields
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_name: e.target.value,
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_email: e.target.value,
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_phone: e.target.value,
      });
    }
  };

  if (!propertyDetail) {
    return <Typography>Loading property details...</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Contact Details for This Listing
      </Typography>

      <Typography sx={{ mb: 3 }}>
        When someone wants to make an enquiry on your listing, they will need a
        way to get in contact with you. We've prefilled this based on your
        account details, but you can adjust this now or later if needed.
      </Typography>

      {/* Name Field */}
      <TextField
        label="Name to display to property seekers when they enquire *"
        variant="filled"
        fullWidth
        value={propertyDetail.contact_name || ""}
        onChange={handleNameChange}
        required
        sx={{ mb: 3 }}
      />

      {/* Email Field with Validation */}
      <TextField
        label="Email address *"
        variant="filled"
        fullWidth
        value={propertyDetail.contact_email || ""}
        onChange={handleEmailChange}
        required
        error={
          propertyDetail.contact_email !== "" &&
          !isValidEmail(propertyDetail.contact_email || "")
        }
        helperText={
          propertyDetail.contact_email !== "" &&
          !isValidEmail(propertyDetail.contact_email || "")
            ? "Please enter a valid email address"
            : ""
        }
        sx={{ mb: 3 }}
      />

      {/* Phone Number Field */}
      <TextField
        label="Phone number *"
        variant="filled"
        fullWidth
        value={propertyDetail.contact_phone || ""}
        onChange={handlePhoneChange}
        required
        sx={{ mb: 3 }}
      />

      {/* Full Enquiry System Upgrade */}
      <FormControlLabel
        control={
          <Radio
            checked={useFullEnquirySystem}
            onChange={(e) => setUseFullEnquirySystem(e.target.checked)}
          />
        }
        label="Add Full Enquiry System Upgrade: Call Connect plus all SMS to your cart ($120.00)"
      />
    </Box>
  );
}
