import { Email, Person, Phone, SupportAgent } from "@mui/icons-material";
import {
  Box,
  FormControlLabel,
  InputAdornment,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Contact() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );


  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleFieldChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        [field]: e.target.value,
      });
    }
  };

  if (!propertyDetail) {
    return <Typography>Loading property details...</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Contact Details for This Listing
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="body2" sx={{ mb: 3, color: "text.secondary" }}>
          When someone wants to make an enquiry on your listing, they will need
          a way to get in contact with you. We've prefilled this based on your
          account details, but you can adjust this now or later if needed.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Name to display to property seekers when they enquire"
            variant="outlined"
            fullWidth
            value={propertyDetail.contact_name || ""}
            onChange={handleFieldChange('contact_name')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email address"
            variant="outlined"
            fullWidth
            value={propertyDetail.contact_email || ""}
            onChange={handleFieldChange('contact_email')}
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Phone number"
            variant="outlined"
            fullWidth
            value={propertyDetail.contact_phone || ""}
            onChange={handleFieldChange('contact_phone')}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <SupportAgent color="primary" />
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            Full Enquiry System Upgrade
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Radio checked={false} disabled />
          }
          label={
            <Box>
              <Typography variant="body1">
                Add Full Enquiry System Upgrade ($120.00)
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Includes Call Connect and SMS notifications for all enquiries
              </Typography>
            </Box>
          }
        />
      </Paper>
    </Box>
  );
}
