import {
  Box,
  FormControlLabel,
  Paper,
  Radio,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";

export default function Description() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const { propertyDetails, updatePropertyDetail } = useRealtyStore();
  const propertyDetail = propertyDetails.find(
    (p) => p.property_id === propertyId
  );

  // Character limits
  const TITLE_LIMIT = 80;
  const DESCRIPTION_LIMIT = 5000;

  // UI state only for the copywriting service option
  const [useCopywritingService, setUseCopywritingService] = useState(false);

  // Update property details in the store when form values change
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
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Description
      </Typography>

      {/* Listing Title */}
      <Typography sx={{ mb: 1 }}>
        <b>Listing title (80 character limit)</b>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Your title needs to jump out at people and make them want to read more.
        Keep it short and descriptive, and focus on your property's strongest
        feature.
      </Typography>
      <TextField
        label="Enter Listing Title"
        variant="filled"
        fullWidth
        value={propertyDetail.listing_title || ""}
        onChange={handleTitleChange}
        helperText={`${propertyDetail.listing_title?.length || 0} / ${TITLE_LIMIT} characters`}
        sx={{ mb: 3 }}
      />

      {/* Description Field */}
      <Typography sx={{ mb: 1 }}>
        <b>Description (5000 character limit)</b>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        Try to include an opening statement, dot points of key features, a
        longer description of what living in the property is like, any nearby
        features, and a closing statement with a strong call to action.
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

      {/* Important Notice */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="body2">
          <b>Important:</b> Don't put your contact details here as this is
          against realestate.com.au's acceptable use policy.
        </Typography>
      </Paper>

      {/* Professional Copywriting Service */}
      <FormControlLabel
        control={
          <Radio
            checked={useCopywritingService}
            onChange={(e) => setUseCopywritingService(e.target.checked)}
          />
        }
        label="Let our professional copywriters handle it! ($120.00)"
      />
    </Box>
  );
}
