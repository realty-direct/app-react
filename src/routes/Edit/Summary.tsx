import {
  Alert,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format, parse } from "date-fns";
import { useNavigate, useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";
import { formatCurrency } from "../../utils/formatters";
import EditIcon from '@mui/icons-material/Edit';

interface SummarySectionProps {
  title: string;
  tabIndex: number;
  propertyId: string;
  data: Array<{
    label: string;
    value: string | number | React.ReactNode;
  }>;
}

function SummarySection({ title, tabIndex, propertyId, data }: SummarySectionProps) {
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/property/${propertyId}/edit`, { state: { tabIndex } });
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {title}
        </Typography>
        <Button
          startIcon={<EditIcon />}
          variant="outlined"
          size="small"
          onClick={handleEdit}
          sx={{ 
            borderRadius: 4,
            px: 2,
            fontWeight: 500
          }}
        >
          Edit
        </Button>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        {data.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6 }} key={index}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default function Summary() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { 
    propertyDetails, 
    updatePropertyDetail, 
    properties,
    propertyFeatures,
    propertyInspections,
    getEnhancementsForProperty
  } = useRealtyStore();

  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );
  const property = properties.find((p) => p.id === propertyId);
  
  const features = propertyFeatures.filter((f) => f.property_id === propertyId);
  
  const inspections = propertyInspections.filter((i) => i.property_id === propertyId);
  
  const enhancements = getEnhancementsForProperty(propertyId);

  const publishOption = propertyDetail?.publish_option || "immediately";
  const publishDateStr = propertyDetail?.publish_date;
  const publishDate = publishDateStr
    ? parse(publishDateStr, "yyyy-MM-dd", new Date())
    : null;

  const handlePublishOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPublishOption = event.target.value;

    updatePropertyDetail(propertyId, {
      publish_option: newPublishOption,
    });

    if (newPublishOption === "later" && !publishDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      updatePropertyDetail(propertyId, {
        publish_date: format(tomorrow, "yyyy-MM-dd"),
      });
    }
  };

  const handlePublishDateChange = (date: Date | null) => {
    updatePropertyDetail(propertyId, {
      publish_date: date ? format(date, "yyyy-MM-dd") : null,
    });
  };

  if (!propertyDetail || !property) {
    return <Typography>Property not found</Typography>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 6 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Review & Finalize
        </Typography>

        <Box>
          <SummarySection
            title="Property Details"
            tabIndex={0}
            propertyId={propertyId}
            data={[
              {
                label: "Address",
                value: property.address,
              },
              {
                label: "Property Type",
                value: propertyDetail.property_type
                  ? `${propertyDetail.property_category ? propertyDetail.property_category.charAt(0).toUpperCase() + propertyDetail.property_category.slice(1) : 'Property'} • ${propertyDetail.property_type.charAt(0).toUpperCase() + propertyDetail.property_type.slice(1)}`
                  : "Not specified",
              },
              {
                label: "Bedrooms",
                value: propertyDetail.bedrooms || "Not specified",
              },
              {
                label: "Bathrooms",
                value: propertyDetail.bathrooms || "Not specified",
              },
              {
                label: "Land Size",
                value: propertyDetail.land_area ? `${propertyDetail.land_area} ${propertyDetail.land_unit || 'm²'}` : "Not specified",
              },
              {
                label: "House Area",
                value: propertyDetail.house_area ? `${propertyDetail.house_area} ${propertyDetail.house_unit || 'm²'}` : "Not specified",
              },
            ]}
          />

          <SummarySection
            title="Property Features"
            tabIndex={1}
            propertyId={propertyId}
            data={
              features.length > 0
                ? features.map(feature => ({
                    label: feature.feature_name || "Feature",
                    value: feature.feature_name || "Not specified"
                  }))
                : [{ label: "Features", value: "No features specified" }]
            }
          />

          <SummarySection
            title="Price Information"
            tabIndex={2}
            propertyId={propertyId}
            data={[
              {
                label: "Price",
                value: propertyDetail.price ? formatCurrency(Number(propertyDetail.price)) : "Not specified",
              },
              {
                label: "Display Option",
                value: propertyDetail.price_display || "Not specified",
              },
            ]}
          />

          <SummarySection
            title="Photos & Media"
            tabIndex={3}
            propertyId={propertyId}
            data={[
              {
                label: "Property Photos",
                value: "View in editor",
              }
            ]}
          />

          <SummarySection
            title="Ownership Information"
            tabIndex={4}
            propertyId={propertyId}
            data={[
              {
                label: "Owner Name",
                value: propertyDetail.contact_name || "Not specified",
              },
              {
                label: "Verification Status",
                value: propertyDetail.ownership_verified ? "Verified" : "Pending verification",
              },
            ]}
          />

          <SummarySection
            title="Property Description"
            tabIndex={5}
            propertyId={propertyId}
            data={[
              {
                label: "Title",
                value: propertyDetail.listing_title || "Not specified",
              },
              {
                label: "Description",
                value: propertyDetail.description 
                  ? propertyDetail.description.length > 100 
                    ? propertyDetail.description.substring(0, 100) + "..." 
                    : propertyDetail.description
                  : "Not specified",
              },
            ]}
          />

          <SummarySection
            title="Contact Information"
            tabIndex={6}
            propertyId={propertyId}
            data={[
              {
                label: "Contact Name",
                value: propertyDetail.contact_name || "Not specified",
              },
              {
                label: "Phone",
                value: propertyDetail.contact_phone || "Not specified",
              },
              {
                label: "Email",
                value: propertyDetail.contact_email || "Not specified",
              },
            ]}
          />

          <SummarySection
            title="Property Inspections"
            tabIndex={7}
            propertyId={propertyId}
            data={
              inspections.length > 0
                ? inspections.map(inspection => ({
                    label: `Inspection (${inspection.inspection_type})`,
                    value: `${inspection.inspection_date ? format(new Date(inspection.inspection_date), "dd/MM/yyyy") : ""} • ${inspection.start_time || ""} - ${inspection.end_time || ""}`
                  }))
                : [{ label: "Inspections", value: "No inspections scheduled" }]
            }
          />

          <SummarySection
            title="Listing Package"
            tabIndex={8}
            propertyId={propertyId}
            data={[
              {
                label: "Selected Package",
                value: propertyDetail.property_package || "Not selected",
              },
            ]}
          />

          <SummarySection
            title="Listing Enhancements"
            tabIndex={9}
            propertyId={propertyId}
            data={
              enhancements.length > 0
                ? enhancements.map(enhancement => ({
                    label: enhancement.enhancement_type
                      .split("-")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" "),
                    value: formatCurrency(enhancement.price)
                  }))
                : [{ label: "Enhancements", value: "No enhancements selected" }]
            }
          />

          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Publishing Options
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

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
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
