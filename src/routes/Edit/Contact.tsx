import {
  Box,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Contact() {
  // TODO: Need to get this info from the store. It can be changed obviously
  const [name, setName] = useState("Tester");
  const [email, setEmail] = useState("jtbusinessau@gmail.com");
  const [phone, setPhone] = useState("0406371630");

  // Validation function for email
  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Contact Details for This Listing
      </Typography>

      <Typography sx={{ mb: 3 }}>
        When someone wants to make an enquiry on your listing, they will need a
        way to get in contact with you. We’ve prefilled this based on your
        account details, but you can adjust this now or later if needed.
      </Typography>

      {/* Name Field */}
      <TextField
        label="Name to display to property seekers when they enquire *"
        variant="filled"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        sx={{ mb: 3 }}
      />

      {/* Email Field with Validation */}
      <TextField
        label="Email address *"
        variant="filled"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        error={!isValidEmail(email)}
        helperText={
          !isValidEmail(email) ? "Please enter a valid email address" : ""
        }
        sx={{ mb: 3 }}
      />

      {/* Phone Number Field */}
      <TextField
        label="Phone number *"
        variant="filled"
        fullWidth
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        sx={{ mb: 3 }}
      />

      {/* Full Enquiry System Upgrade */}
      <FormControlLabel
        control={<Radio />}
        label="Add Full Enquiry System Upgrade: Call Connect plus all SMS to your cart ($120.00)"
      />
    </Box>
  );
}
