import {
  Box,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";
  
  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [useFullEnquirySystem, setUseFullEnquirySystem] = useState(false);

  // Validation function for email
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Initialize form with data from store when component mounts or propertyDetail changes
  useEffect(() => {
    if (propertyDetail) {
      setName(propertyDetail.contact_name || "");
      setEmail(propertyDetail.contact_email || "");
      setPhone(propertyDetail.contact_phone || "");
    }
  }, [propertyDetail]);

  // Update property details in the store when form values change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_name: newName,
      });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_email: newEmail,
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        contact_phone: newPhone,
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
        value={name}
        onChange={handleNameChange}
        required
        sx={{ mb: 3 }}
      />

      {/* Email Field with Validation */}
      <TextField
        label="Email address *"
        variant="filled"
        fullWidth
        value={email}
        onChange={handleEmailChange}
        required
        error={email.length > 0 && !isValidEmail(email)}
        helperText={
          email.length > 0 && !isValidEmail(email) ? "Please enter a valid email address" : ""
        }
        sx={{ mb: 3 }}
      />

      {/* Phone Number Field */}
      <TextField
        label="Phone number *"
        variant="filled"
        fullWidth
        value={phone}
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