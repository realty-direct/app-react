import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Summary() {
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);
  const [publishOption, setPublishOption] = useState("immediately");

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        You’re Almost There!
      </Typography>

      {/* Sign Information */}
      <Typography sx={{ mb: 2 }}>
        Your package includes a <b>customizable 600x900 sign.</b>
      </Typography>

      <Paper
        sx={{ p: 3, textAlign: "center", backgroundColor: "#f9f9f9", mb: 3 }}
      >
        <Typography variant="subtitle1">
          On the sign, we'll print: <b>0406371630</b>
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 2 }}
            onClick={() => setPhoneConfirmed(true)}
          >
            Confirm
          </Button>
          <Button variant="outlined" color="secondary">
            Update Number
          </Button>
        </Box>
      </Paper>

      {/* Confirmation Status */}
      {!phoneConfirmed ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Not Confirmed
        </Alert>
      ) : (
        <Alert severity="success" sx={{ mb: 3 }}>
          Confirmed
        </Alert>
      )}

      {/* Publish Timing */}
      <Typography sx={{ mb: 1 }}>
        When do you want to publish your listing?
      </Typography>
      <RadioGroup
        value={publishOption}
        onChange={(e) => setPublishOption(e.target.value)}
        sx={{ gap: 1, mb: 3 }}
      >
        <FormControlLabel
          value="immediately"
          control={<Radio />}
          label="Immediately"
        />
        <FormControlLabel value="later" control={<Radio />} label="Later" />
      </RadioGroup>

      {/* Submit Button */}
      <Button variant="contained" color="primary" fullWidth>
        Finalize Listing
      </Button>
    </Box>
  );
}
