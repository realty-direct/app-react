import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HouseIcon from "@mui/icons-material/House";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Button,
  Chip,
  Divider,
  FormHelperText,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { format } from "date-fns";
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { Inspection } from "../../database/inspections";
import useRealtyStore from "../../store/store";

interface InspectionTime {
  date: Date | null;
  start: string;
  end: string;
  id?: string;
  hasError?: boolean;
  errorMessage?: string;
}

// Generate times in 15-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      options.push(`${hourStr}:${minuteStr}`);
    }
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

// Format time for display (convert 24h to 12h format)
const formatTimeDisplay = (time24h: string) => {
  const [hours, minutes] = time24h.split(":");
  const hoursNum = parseInt(hours, 10);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const hours12 = hoursNum % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

export default function Inspections() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyInspections,
    setPropertyInspections,
    deletePropertyInspection: removeInspection,
  } = useRealtyStore();

  // Get inspections for this property directly from the store
  const currentPropertyInspections = propertyInspections.filter(
    (insp) => insp.property_id === propertyId
  );

  const currentOpenHouses = currentPropertyInspections.filter(
    (insp) => insp.inspection_type === "public"
  );

  const currentPrivateInspections = currentPropertyInspections.filter(
    (insp) => insp.inspection_type === "private"
  );

  // Initialize with current inspections from the store or a default empty one
  const [openHouseTimes, setOpenHouseTimes] = useState<InspectionTime[]>(
    currentOpenHouses.length > 0
      ? currentOpenHouses.map((i) => ({
          id: i.id,
          date: new Date(i.inspection_date),
          start: i.start_time,
          end: i.end_time,
          hasError: false,
        }))
      : [{ date: null, start: "09:00", end: "10:00", hasError: false }]
  );

  const [privateInspectionTimes, setPrivateInspectionTimes] = useState<
    InspectionTime[]
  >(
    currentPrivateInspections.length > 0
      ? currentPrivateInspections.map((i) => ({
          id: i.id,
          date: new Date(i.inspection_date),
          start: i.start_time,
          end: i.end_time,
          hasError: false,
        }))
      : [{ date: null, start: "09:00", end: "10:00", hasError: false }]
  );

  // Helper function to convert time state to inspection objects for Zustand
  const updateZustandInspections = () => {
    if (!propertyId) return;

    const otherPropertiesInspections = propertyInspections.filter(
      (insp) => insp.property_id !== propertyId
    );

    const newInspections: Inspection[] = [];

    // Add open house inspections
    for (const time of openHouseTimes) {
      if (time.date && !time.hasError) {
        try {
          const inspectionDate = time.date.toISOString().split("T")[0];

          if (time.id) {
            // Existing inspection
            newInspections.push({
              id: time.id,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "public",
            });
          } else {
            // New inspection
            newInspections.push({
              id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "public",
            });
          }
        } catch (error) {
          console.error("Error processing open house date:", error);
        }
      }
    }

    // Add private inspections
    for (const time of privateInspectionTimes) {
      if (time.date && !time.hasError) {
        try {
          const inspectionDate = time.date.toISOString().split("T")[0];

          if (time.id) {
            // Existing inspection
            newInspections.push({
              id: time.id,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "private",
            });
          } else {
            // New inspection
            newInspections.push({
              id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "private",
            });
          }
        } catch (error) {
          console.error("Error processing private inspection date:", error);
        }
      }
    }

    // Update Zustand with all inspections
    setPropertyInspections([...otherPropertiesInspections, ...newInspections]);
  };

  // Handle date change
  const handleDateChange = (
    index: number,
    newDate: Date | null,
    isPrivate: boolean
  ) => {
    const updateTimes = (times: InspectionTime[]): InspectionTime[] =>
      times.map((item, i) => (i === index ? { ...item, date: newDate } : item));

    if (isPrivate) {
      setPrivateInspectionTimes(updateTimes(privateInspectionTimes));
    } else {
      setOpenHouseTimes(updateTimes(openHouseTimes));
    }

    // Update Zustand after state is set
    setTimeout(updateZustandInspections, 0);
  };

  // Handle time changes
  const handleTimeChange = (
    index: number,
    field: "start" | "end",
    value: string,
    isPrivate: boolean
  ) => {
    const times = isPrivate ? [...privateInspectionTimes] : [...openHouseTimes];
    const time = times[index];

    // Validate time range
    let hasError = false;
    let errorMessage = "";

    if (field === "start" && value >= time.end) {
      hasError = true;
      errorMessage = "Start time must be before end time";
    } else if (field === "end" && value <= time.start) {
      hasError = true;
      errorMessage = "End time must be after start time";
    }

    // Create a new time object with updated field
    const updatedTime = {
      ...time,
      [field]: value,
      hasError,
      errorMessage,
    };

    // Update the time at the specific index
    times[index] = updatedTime;

    // Update state with new array
    if (isPrivate) {
      setPrivateInspectionTimes(times);
    } else {
      setOpenHouseTimes(times);
    }

    // Update Zustand after state update
    setTimeout(updateZustandInspections, 0);
  };

  // Function to add new open house time
  const addOpenHouseTime = () => {
    setOpenHouseTimes([
      ...openHouseTimes,
      { date: null, start: "09:00", end: "10:00", hasError: false },
    ]);
  };

  // Function to add new private inspection time
  const addPrivateInspectionTime = () => {
    setPrivateInspectionTimes([
      ...privateInspectionTimes,
      { date: null, start: "09:00", end: "10:00", hasError: false },
    ]);
  };

  // Function to remove an entry
  const removeTime = (index: number, isPrivate: boolean) => {
    const times = isPrivate ? privateInspectionTimes : openHouseTimes;
    const time = times[index];

    if (time.id) {
      // If the inspection has an ID, delete it from the database via Zustand
      removeInspection(time.id);
    }

    // Update local state
    if (isPrivate) {
      setPrivateInspectionTimes(
        privateInspectionTimes.filter((_, i) => i !== index)
      );
    } else {
      setOpenHouseTimes(openHouseTimes.filter((_, i) => i !== index));
    }

    // Update Zustand after state update
    setTimeout(updateZustandInspections, 0);
  };

  // Check if we have any scheduled inspections
  const hasScheduledOpenHouses = openHouseTimes.some(
    (time) => time.date !== null
  );
  const hasScheduledPrivateInspections = privateInspectionTimes.some(
    (time) => time.date !== null
  );

  // Dynamic background colors based on theme mode
  const summaryBgColor = isDarkMode ? "#1a2035" : "#f5f9ff";
  const summaryBorderColor = isDarkMode ? "#2d3748" : "#e0e9fd";
  const scheduledBgColor = isDarkMode ? "#1e293b" : "#f8f9fa";
  const infoBgColor = isDarkMode ? "#1a2035" : "#f8f8f8";
  const borderColor = isDarkMode ? "#2d3748" : "#e0e0e0";
  const errorBorderColor = isDarkMode ? "#f44336" : "#f44336";
  const deleteBtnHoverBg = isDarkMode ? "#451419" : "#ffebee";
  const deleteBtnHoverBorder = isDarkMode ? "#8b2130" : "#ffcdd2";

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 6 } }}>
        {/* Header */}
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Property Inspections
        </Typography>

        {/* Summary of scheduled inspections */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            backgroundColor: summaryBgColor,
            border: `1px solid ${summaryBorderColor}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <EventAvailableIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Inspection Schedule Summary</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <HouseIcon
                  sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                />
                <Typography variant="subtitle1">
                  Open House Inspections
                </Typography>
              </Box>

              {hasScheduledOpenHouses ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, ml: 4 }}>
                  {openHouseTimes
                    .filter((time) => time.date !== null)
                    .map((time, index) => (
                      <Chip
                        key={`summary-open-${index}`}
                        label={`${format(time.date as Date, "dd MMM")} · ${formatTimeDisplay(time.start)} - ${formatTimeDisplay(time.end)}`}
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1, mb: 1 }}
                      />
                    ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ ml: 4, color: "text.secondary" }}
                >
                  No open house inspections scheduled
                </Typography>
              )}
            </Box>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <PersonIcon
                  sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                />
                <Typography variant="subtitle1">Private Inspections</Typography>
              </Box>

              {hasScheduledPrivateInspections ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, ml: 4 }}>
                  {privateInspectionTimes
                    .filter((time) => time.date !== null)
                    .map((time, index) => (
                      <Chip
                        key={`summary-private-${index}`}
                        label={`${format(time.date as Date, "dd MMM")} · ${formatTimeDisplay(time.start)} - ${formatTimeDisplay(time.end)}`}
                        color="secondary"
                        variant="outlined"
                        sx={{ borderRadius: 1, mb: 1 }}
                      />
                    ))}
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  sx={{ ml: 4, color: "text.secondary" }}
                >
                  No private inspections scheduled
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        {/* Open House Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <HouseIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Open House Inspections</Typography>
          </Box>

          <Typography sx={{ mb: 3 }}>
            Set open house times when multiple prospective buyers can view your
            property simultaneously.
          </Typography>

          {openHouseTimes.map((time, index) => (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                border: time.hasError
                  ? `1px solid ${errorBorderColor}`
                  : `1px solid ${borderColor}`,
                borderRadius: 1,
                backgroundColor: time.date
                  ? scheduledBgColor
                  : "background.paper",
                position: "relative",
              }}
              key={`open-house-${time.id || index}`}
            >
              {time.date && (
                <Chip
                  size="small"
                  label="Scheduled"
                  color="primary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    borderRadius: 1,
                  }}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <DatePicker
                  label="Inspection Date *"
                  value={time.date}
                  onChange={(newDate) =>
                    handleDateChange(index, newDate, false)
                  }
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      required: true,
                      size: "medium",
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Times in 15-minute intervals
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Select
                  label="Start Time"
                  variant="outlined"
                  fullWidth
                  value={time.start}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      "start",
                      e.target.value as string,
                      false
                    )
                  }
                  sx={{ flex: 1 }}
                >
                  {TIME_OPTIONS.map((option) => (
                    <MenuItem key={`open-start-${option}`} value={option}>
                      {formatTimeDisplay(option)}
                    </MenuItem>
                  ))}
                </Select>

                <Typography
                  sx={{ display: { xs: "none", sm: "flex" } }}
                  color="text.secondary"
                >
                  to
                </Typography>

                <Typography
                  sx={{ display: { xs: "flex", sm: "none" } }}
                  color="text.secondary"
                >
                  to
                </Typography>

                <Select
                  label="End Time"
                  variant="outlined"
                  fullWidth
                  value={time.end}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      "end",
                      e.target.value as string,
                      false
                    )
                  }
                  sx={{ flex: 1 }}
                  error={time.hasError}
                >
                  {TIME_OPTIONS.map((option) => (
                    <MenuItem key={`open-end-${option}`} value={option}>
                      {formatTimeDisplay(option)}
                    </MenuItem>
                  ))}
                </Select>

                <Tooltip title="Remove">
                  <IconButton
                    onClick={() => removeTime(index, false)}
                    color="error"
                    size="medium"
                    sx={{
                      border: `1px solid ${borderColor}`,
                      "&:hover": {
                        backgroundColor: deleteBtnHoverBg,
                        borderColor: deleteBtnHoverBorder,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {time.hasError && (
                <FormHelperText error sx={{ mb: 1 }}>
                  {time.errorMessage}
                </FormHelperText>
              )}

              {time.date && (
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: 500 }}
                >
                  Scheduled: {format(time.date, "EEEE, MMMM d, yyyy")} from{" "}
                  {formatTimeDisplay(time.start)} to{" "}
                  {formatTimeDisplay(time.end)}
                </Typography>
              )}
            </Paper>
          ))}

          <Button
            variant="outlined"
            onClick={addOpenHouseTime}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              mt: 1,
              borderRadius: 1,
              textTransform: "none",
            }}
            onMouseUp={() => setTimeout(updateZustandInspections, 50)}
          >
            Add Open House Time
          </Button>
        </Paper>

        {/* Private Inspection Section */}
        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <PersonIcon sx={{ mr: 1, color: "secondary.main" }} />
            <Typography variant="h6">Private Inspections</Typography>
          </Box>

          <Typography sx={{ mb: 2 }}>
            Set times when you're available for one-on-one private inspections
            with potential buyers.
          </Typography>

          <Box
            sx={{
              p: 2,
              mb: 3,
              backgroundColor: infoBgColor,
              borderRadius: 1,
              border: `1px solid ${borderColor}`,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              • If you don't set specific times, buyers can still request
              inspections at times that suit them
              <br />
              • Private inspection booking is only supported on
              realestate.com.au
              <br />
              • The platform automatically creates 10-minute booking slots with
              5-minute gaps
              <br />• For best results, set availability of at least 1 hour per
              session
            </Typography>
          </Box>

          {privateInspectionTimes.map((time, index) => (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 2,
                border: time.hasError
                  ? `1px solid ${errorBorderColor}`
                  : `1px solid ${borderColor}`,
                borderRadius: 1,
                backgroundColor: time.date
                  ? scheduledBgColor
                  : "background.paper",
                position: "relative",
              }}
              key={`private-inspection-${time.id || index}`}
            >
              {time.date && (
                <Chip
                  size="small"
                  label="Scheduled"
                  color="secondary"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    borderRadius: 1,
                  }}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 2,
                }}
              >
                <DatePicker
                  label="Inspection Date *"
                  value={time.date}
                  onChange={(newDate) => handleDateChange(index, newDate, true)}
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      fullWidth: true,
                      required: true,
                      size: "medium",
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Times in 15-minute intervals
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  mb: 2,
                  alignItems: "center",
                }}
              >
                <Select
                  label="Start Time"
                  variant="outlined"
                  fullWidth
                  value={time.start}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      "start",
                      e.target.value as string,
                      true
                    )
                  }
                  sx={{ flex: 1 }}
                >
                  {TIME_OPTIONS.map((option) => (
                    <MenuItem key={`private-start-${option}`} value={option}>
                      {formatTimeDisplay(option)}
                    </MenuItem>
                  ))}
                </Select>

                <Typography
                  sx={{ display: { xs: "none", sm: "flex" } }}
                  color="text.secondary"
                >
                  to
                </Typography>

                <Typography
                  sx={{ display: { xs: "flex", sm: "none" } }}
                  color="text.secondary"
                >
                  to
                </Typography>

                <Select
                  label="End Time"
                  variant="outlined"
                  fullWidth
                  value={time.end}
                  onChange={(e) =>
                    handleTimeChange(
                      index,
                      "end",
                      e.target.value as string,
                      true
                    )
                  }
                  sx={{ flex: 1 }}
                  error={time.hasError}
                >
                  {TIME_OPTIONS.map((option) => (
                    <MenuItem key={`private-end-${option}`} value={option}>
                      {formatTimeDisplay(option)}
                    </MenuItem>
                  ))}
                </Select>

                <Tooltip title="Remove">
                  <IconButton
                    onClick={() => removeTime(index, true)}
                    color="error"
                    size="medium"
                    sx={{
                      border: `1px solid ${borderColor}`,
                      "&:hover": {
                        backgroundColor: deleteBtnHoverBg,
                        borderColor: deleteBtnHoverBorder,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {time.hasError && (
                <FormHelperText error sx={{ mb: 1 }}>
                  {time.errorMessage}
                </FormHelperText>
              )}

              {time.date && (
                <Typography
                  variant="body2"
                  color="secondary.main"
                  sx={{ fontWeight: 500 }}
                >
                  Scheduled: {format(time.date, "EEEE, MMMM d, yyyy")} from{" "}
                  {formatTimeDisplay(time.start)} to{" "}
                  {formatTimeDisplay(time.end)}
                </Typography>
              )}
            </Paper>
          ))}

          <Button
            variant="outlined"
            color="secondary"
            onClick={addPrivateInspectionTime}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              mt: 1,
              borderRadius: 1,
              textTransform: "none",
            }}
            onMouseUp={() => setTimeout(updateZustandInspections, 50)}
          >
            Add Private Inspection Time
          </Button>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
