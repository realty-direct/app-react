import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function Inspections() {
  const [openHouseTimes, setOpenHouseTimes] = useState([
    { date: "", start: "", end: "" },
  ]);
  const [privateInspectionTimes, setPrivateInspectionTimes] = useState([
    { date: "", start: "", end: "" },
  ]);

  // Function to handle input changes
  const handleChange = (
    index: number,
    field: "date" | "start" | "end",
    value: string,
    isPrivate: boolean
  ) => {
    const updateTimes = (
      times: { date: string; start: string; end: string }[]
    ) =>
      times.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      );

    if (isPrivate) {
      setPrivateInspectionTimes((prevTimes) => updateTimes(prevTimes));
    } else {
      setOpenHouseTimes((prevTimes) => updateTimes(prevTimes));
    }
  };

  // Function to add new open house time
  const addOpenHouseTime = () => {
    setOpenHouseTimes([...openHouseTimes, { date: "", start: "", end: "" }]);
  };

  // Function to add new private inspection time
  const addPrivateInspectionTime = () => {
    setPrivateInspectionTimes([
      ...privateInspectionTimes,
      { date: "", start: "", end: "" },
    ]);
  };

  // Function to remove an entry
  const removeTime = (index: number, isPrivate: boolean) => {
    const updateTimes = (
      times: { date: string; start: string; end: string }[]
    ) => times.filter((_, i) => i !== index); // Creates a new array without modifying state

    if (isPrivate) {
      setPrivateInspectionTimes((prevTimes) => updateTimes(prevTimes));
    } else {
      setOpenHouseTimes((prevTimes) => updateTimes(prevTimes));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 6 } }}>
      {/* Header */}
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Inspections (Optional)
      </Typography>

      {/* Open House Section */}
      <Typography sx={{ mb: 2 }}>
        Set an open house time for prospective buyers or tenants to view your
        property.
      </Typography>

      {openHouseTimes.map((time, index) => (
        <Paper
          sx={{ p: 2, mb: 2 }}
          key={`open-house-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
        >
          <TextField
            label="Date *"
            type="date"
            variant="filled"
            fullWidth
            value={time.date}
            onChange={(e) => handleChange(index, "date", e.target.value, false)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="What time will it start? *"
            type="time"
            variant="filled"
            fullWidth
            value={time.start}
            onChange={(e) =>
              handleChange(index, "start", e.target.value, false)
            }
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="What time will it end? *"
            type="time"
            variant="filled"
            fullWidth
            value={time.end}
            onChange={(e) => handleChange(index, "end", e.target.value, false)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <IconButton onClick={() => removeTime(index, false)} color="error">
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      <Button variant="outlined" onClick={addOpenHouseTime} sx={{ mb: 3 }}>
        Add an open house time
      </Button>

      {/* Private Inspection Section */}
      <Typography sx={{ mb: 2 }}>
        In addition to any advertised open house times, you may also set the
        days and times you are available for prospective buyers or tenants to
        book a private inspection.
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        If you don't set specific times, property seekers can still request a
        private inspection at a time that suits them.
        <br />
        Only realestate.com.au supports private inspection booking, these times
        will not be shown on Domain.
        <br />
        Realestate.com.au will automatically split your availability into
        10-minute booking slots with a 5-minute gap between bookings. Avoid
        setting complex availability, full-day availability, or availability
        shorter than 1 hour.
      </Typography>

      {privateInspectionTimes.map((time, index) => (
        <Paper
          sx={{ p: 2, mb: 2 }}
          key={`private-inspection-${
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            index
          }`}
        >
          <TextField
            label="Date *"
            type="date"
            variant="filled"
            fullWidth
            value={time.date}
            onChange={(e) => handleChange(index, "date", e.target.value, true)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="What time will it start? *"
            type="time"
            variant="filled"
            fullWidth
            value={time.start}
            onChange={(e) => handleChange(index, "start", e.target.value, true)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="What time will it end? *"
            type="time"
            variant="filled"
            fullWidth
            value={time.end}
            onChange={(e) => handleChange(index, "end", e.target.value, true)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <IconButton onClick={() => removeTime(index, true)} color="error">
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}

      <Button
        variant="outlined"
        onClick={addPrivateInspectionTime}
        sx={{ mt: 2 }}
      >
        Add a private inspection time
      </Button>
    </Box>
  );
}
