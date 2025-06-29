import {
  Alert,
  Box,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Description() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  const TITLE_LIMIT = 80;
  const DESCRIPTION_LIMIT = 5000;


  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= TITLE_LIMIT && propertyDetail && propertyId) {
      updatePropertyDetail(propertyId, {
        listing_title: newTitle,
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDescription = e.target.value;
    if (
      newDescription.length <= DESCRIPTION_LIMIT &&
      propertyDetail &&
      propertyId
    ) {
      updatePropertyDetail(propertyId, {
        description: newDescription,
      });
    }
  };

  if (!propertyDetail) {
    return <Typography>Loading property details...</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Property Description
      </Typography>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Listing Title{" "}
          <Box component="span" sx={{ color: "error.main" }}>
            *
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Your title needs to jump out at people and make them want to read
          more. Keep it short and descriptive, and focus on your property's
          strongest feature.
        </Typography>
        <TextField
          label="Enter Listing Title"
          variant="outlined"
          fullWidth
          value={propertyDetail.listing_title || ""}
          onChange={handleTitleChange}
          helperText={`${propertyDetail.listing_title?.length || 0} / ${TITLE_LIMIT} characters`}
          sx={{ mb: 3 }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: "medium" }}>
          Description{" "}
          <Box component="span" sx={{ color: "error.main" }}>
            *
          </Box>
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          Try to include an opening statement, dot points of key features, a
          longer description of what living in the property is like, any nearby
          features, and a closing statement.
        </Typography>
        <TextField
          label="Enter Property Description"
          variant="filled"
          fullWidth
          multiline
          rows={6}
          value={propertyDetail.description || ""}
          onChange={handleDescriptionChange}
          helperText={`${propertyDetail.description?.length || 0} / ${DESCRIPTION_LIMIT} characters`}
          sx={{ mb: 3 }}
        />
      </Paper>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <b>Important:</b> Don't put your contact details here as this is
          against realestate.com.au's acceptable use policy.
        </Typography>
      </Alert>

      <FormControlLabel
        control={<Radio checked={false} disabled />}
        label="Let our professional copywriters handle it! ($120.00)"
      />
    </Box>
  );
}
