import CheckIcon from "@mui/icons-material/Check";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parse } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Summary() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";
  const navigate = useNavigate();

  // Access store data
  const { propertyDetails, updatePropertyDetail, properties } =
    useRealtyStore();

  // Find the property and its details
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );
  const property = properties.find((p) => p.id === propertyId);

  // Get values directly from the store - no local state
  const publishOption = propertyDetail?.publish_option || "immediately";
  const publishDateStr = propertyDetail?.publish_date;
  const publishDate = publishDateStr
    ? parse(publishDateStr, "yyyy-MM-dd", new Date())
    : null;
  const phoneConfirmed = propertyDetail?.phone_confirmed || false;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(amount);
  };

  // Handle publish option change - update store directly
  const handlePublishOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPublishOption = event.target.value;

    // Update the store
    updatePropertyDetail(propertyId, {
      publish_option: newPublishOption,
    });

    // If switching to scheduled, set a default date if none exists
    if (newPublishOption === "later" && !publishDate) {
      // Set default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      updatePropertyDetail(propertyId, {
        publish_date: format(tomorrow, "yyyy-MM-dd"),
      });
    }
  };

  // Handle publish date change - update store directly
  const handlePublishDateChange = (date: Date | null) => {
    updatePropertyDetail(propertyId, {
      publish_date: date ? format(date, "yyyy-MM-dd") : null,
    });
  };

  // Handle phone confirmation - update store directly
  const handleConfirmPhone = () => {
    updatePropertyDetail(propertyId, {
      phone_confirmed: true,
    });
  };

  // Handle phone update - update store and navigate
  const handleUpdatePhone = () => {
    updatePropertyDetail(propertyId, {
      phone_confirmed: false,
    });
    // Navigate to the contact details page to update the phone
    navigate(`/property/${propertyId}/edit`, { state: { tabIndex: 6 } }); // 6 is the Contact tab
  };

  if (!propertyDetail || !property) {
    return <Typography>Property not found</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 6 } }}>
        {/* Header */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Review & Finalize
        </Typography>

        {/* Main content */}
        <Box>
          {/* For Sale Sign Information */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Your For Sale Sign
            </Typography>

            <Typography sx={{ mb: 2 }}>
              Your package includes a <b>customizable 600×900 sign.</b>
            </Typography>

            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography sx={{ fontWeight: "medium", mb: 1 }}>
                On the sign, we'll print:
              </Typography>
              <Typography variant="h6" sx={{ textAlign: "center", py: 1 }}>
                {propertyDetail?.contact_phone || "No phone number provided"}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                  gap: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  disabled={phoneConfirmed}
                  onClick={handleConfirmPhone}
                >
                  {phoneConfirmed ? (
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CheckIcon sx={{ mr: 1 }} />
                      Confirmed
                    </Box>
                  ) : (
                    "Confirm"
                  )}
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleUpdatePhone}
                >
                  Update Number
                </Button>
              </Box>
            </Box>

            {/* Confirmation Status */}
            {!phoneConfirmed ? (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Please confirm your phone number for the sign
              </Alert>
            ) : (
              <Alert severity="success" sx={{ mb: 2 }}>
                Phone number confirmed
              </Alert>
            )}
          </Paper>

          {/* Publish Timing */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              When do you want to publish your listing?
            </Typography>

            <RadioGroup
              value={publishOption}
              onChange={handlePublishOptionChange}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="immediately"
                control={<Radio />}
                label={
                  <Box>
                    <Typography fontWeight="medium">Immediately</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your listing will go live as soon as our team approves it
                      (usually within 24 hours)
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                value="later"
                control={<Radio />}
                label={
                  <Box>
                    <Typography fontWeight="medium">
                      Schedule for later
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose a specific date when your listing should go live
                    </Typography>
                  </Box>
                }
              />
            </RadioGroup>

            {/* Date Picker (Only shown when "later" is selected) */}
            {publishOption === "later" && (
              <Box sx={{ pl: 4, mb: 2 }}>
                <DatePicker
                  label="Publish Date"
                  value={publishDate}
                  onChange={handlePublishDateChange}
                  disablePast
                  slotProps={{
                    textField: {
                      helperText:
                        "Your listing will go live on this date, subject to approval",
                      fullWidth: true,
                      required: publishOption === "later",
                    },
                  }}
                />
              </Box>
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              Your listing will be reviewed by our team before going live to
              ensure it meets all requirements and guidelines.
            </Alert>
          </Paper>

          {/* Property Address Summary */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Property
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography fontWeight="medium">{property.address}</Typography>
              <Typography variant="body2" color="text.secondary">
                {propertyDetail.property_category &&
                  propertyDetail.property_category.charAt(0).toUpperCase() +
                    propertyDetail.property_category.slice(1)}
                {propertyDetail.property_type &&
                  ` • ${
                    propertyDetail.property_type.charAt(0).toUpperCase() +
                    propertyDetail.property_type.slice(1)
                  }`}
              </Typography>

              {propertyDetail.price && (
                <Typography>
                  Price: {formatCurrency(Number(propertyDetail.price))}
                </Typography>
              )}
            </Box>

            <Button
              sx={{ mt: 2 }}
              variant="outlined"
              size="small"
              onClick={() => navigate(`/property/${propertyId}/edit`)}
            >
              Edit Details
            </Button>
          </Paper>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
