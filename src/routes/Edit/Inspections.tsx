import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
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

export default function Inspections() {
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyInspections,
    setPropertyInspections,
    deletePropertyInspection: removeInspection,
  } = useRealtyStore();

  // Local state for form management
  const [openHouseTimes, setOpenHouseTimes] = useState<InspectionTime[]>([
    { date: null, start: "09:00", end: "09:15", hasError: false },
  ]);
  const [privateInspectionTimes, setPrivateInspectionTimes] = useState<
    InspectionTime[]
  >([{ date: null, start: "09:00", end: "09:15", hasError: false }]);

  // Helper function to convert time state to inspection objects for Zustand
  const updateZustandInspections = () => {
    if (!propertyId) return;

    const currentPropertyInspections = propertyInspections.filter(
      (insp) => insp.property_id !== propertyId
    );

    const inspections: Inspection[] = [];

    // Add open house inspections
    openHouseTimes.forEach((time) => {
      if (time.date && !time.hasError) {
        try {
          const inspectionDate = time.date.toISOString().split("T")[0];

          if (time.id) {
            // Existing inspection
            inspections.push({
              id: time.id,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "open_house",
            });
          } else {
            // New inspection
            inspections.push({
              id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "open_house",
            });
          }
        } catch (error) {
          console.error("Error processing open house date:", error);
        }
      }
    });

    // Add private inspections
    privateInspectionTimes.forEach((time) => {
      if (time.date && !time.hasError) {
        try {
          const inspectionDate = time.date.toISOString().split("T")[0];

          if (time.id) {
            // Existing inspection
            inspections.push({
              id: time.id,
              property_id: propertyId,
              inspection_date: inspectionDate,
              start_time: time.start,
              end_time: time.end,
              inspection_type: "private",
            });
          } else {
            // New inspection
            inspections.push({
              id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
    });

    // Update Zustand with all inspections (from other properties + updated ones for this property)
    setPropertyInspections([...currentPropertyInspections, ...inspections]);
  };

  // Fetch inspections when component mounts
  useEffect(() => {
    const loadInspections = async () => {
      if (propertyId) {
        // Filter property inspections that match this property ID
        const currentInspections = propertyInspections.filter(
          (insp) => insp.property_id === propertyId
        );

        console.log(
          `Found ${currentInspections.length} inspections for this property`
        );

        // Group inspections by type
        const openHouse = currentInspections.filter(
          (i) => i.inspection_type === "open_house"
        );
        const privateInspection = currentInspections.filter(
          (i) => i.inspection_type === "private"
        );

        // Set local state if we have inspections
        if (openHouse.length > 0) {
          setOpenHouseTimes(
            openHouse.map((i) => ({
              id: i.id,
              date: new Date(i.inspection_date),
              start: i.start_time,
              end: i.end_time,
              hasError: false,
            }))
          );
        }

        if (privateInspection.length > 0) {
          console.log(
            `Setting ${privateInspection.length} private inspection times`
          );
          setPrivateInspectionTimes(
            privateInspection.map((i) => ({
              id: i.id,
              date: new Date(i.inspection_date),
              start: i.start_time,
              end: i.end_time,
              hasError: false,
            }))
          );
        }
      }
    };

    loadInspections();
  }, [propertyId, propertyInspections.length]); // Only run when propertyId or the length of inspections changes

  // Validate time (ensure start is before end)
  const validateTimeRange = (start: string, end: string): boolean => {
    return start < end;
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
      const newTimes = updateTimes(privateInspectionTimes);
      setPrivateInspectionTimes(newTimes);
      // Update Zustand only after state is set
      setTimeout(() => updateZustandInspections(), 0);
    } else {
      const newTimes = updateTimes(openHouseTimes);
      setOpenHouseTimes(newTimes);
      // Update Zustand only after state is set
      setTimeout(() => updateZustandInspections(), 0);
    }
  };

  // Handle time changes
  const handleTimeChange = (
    index: number,
    field: "start" | "end",
    value: string,
    isPrivate: boolean
  ) => {
    if (isPrivate) {
      const times = [...privateInspectionTimes];
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
      setPrivateInspectionTimes(times);

      // Update Zustand after state update
      setTimeout(() => updateZustandInspections(), 0);
    } else {
      const times = [...openHouseTimes];
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
      setOpenHouseTimes(times);

      // Update Zustand after state update
      setTimeout(() => updateZustandInspections(), 0);
    }
  };

  // Function to add new open house time
  const addOpenHouseTime = () => {
    const newTimes = [
      ...openHouseTimes,
      { date: null, start: "09:00", end: "09:15", hasError: false },
    ];
    setOpenHouseTimes(newTimes);
  };

  // Function to add new private inspection time
  const addPrivateInspectionTime = () => {
    const newTimes = [
      ...privateInspectionTimes,
      { date: null, start: "09:00", end: "09:15", hasError: false },
    ];
    setPrivateInspectionTimes(newTimes);
  };

  // Function to remove an entry
  const removeTime = async (index: number, isPrivate: boolean) => {
    const times = isPrivate ? privateInspectionTimes : openHouseTimes;
    const time = times[index];

    if (time.id) {
      // If the inspection has an ID, delete it from the database via Zustand

      removeInspection(time.id);
    } else {
    }

    // Update local state
    if (isPrivate) {
      const newTimes = privateInspectionTimes.filter((_, i) => i !== index);
      setPrivateInspectionTimes(newTimes);
    } else {
      const newTimes = openHouseTimes.filter((_, i) => i !== index);
      setOpenHouseTimes(newTimes);
    }

    // Update Zustand after state update
    setTimeout(() => updateZustandInspections(), 0);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            sx={{
              p: 3,
              mb: 2,
              border: time.hasError ? "1px solid red" : "none",
            }}
            key={`open-house-${time.id || index}`}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <DatePicker
                label="Date *"
                value={time.date}
                onChange={(newDate) => handleDateChange(index, newDate, false)}
                slotProps={{
                  textField: {
                    variant: "filled",
                    fullWidth: true,
                    required: true,
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
                <AccessTimeIcon />
                <Typography variant="body2">
                  Times are in 15 minute intervals:
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Select
                label="Start Time *"
                variant="filled"
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ display: "flex", alignItems: "center" }}>
                to
              </Typography>

              <Select
                label="End Time *"
                variant="filled"
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              <Tooltip title="Remove">
                <IconButton
                  onClick={() => removeTime(index, false)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {time.hasError && (
              <FormHelperText error>{time.errorMessage}</FormHelperText>
            )}
          </Paper>
        ))}

        <Button
          variant="outlined"
          onClick={addOpenHouseTime}
          sx={{ mb: 3 }}
          onMouseUp={() => setTimeout(() => updateZustandInspections(), 50)}
        >
          Add an open house time
        </Button>

        {/* Private Inspection Section */}
        <Typography sx={{ mb: 2, mt: 4 }}>
          In addition to any advertised open house times, you may also set the
          days and times you are available for prospective buyers or tenants to
          book a private inspection.
        </Typography>

        <Typography variant="body2" sx={{ mb: 2 }}>
          If you don't set specific times, property seekers can still request a
          private inspection at a time that suits them.
          <br />
          Only realestate.com.au supports private inspection booking, these
          times will not be shown on Domain.
          <br />
          Realestate.com.au will automatically split your availability into
          10-minute booking slots with a 5-minute gap between bookings. Avoid
          setting complex availability, full-day availability, or availability
          shorter than 1 hour.
        </Typography>

        {privateInspectionTimes.map((time, index) => (
          <Paper
            sx={{
              p: 3,
              mb: 2,
              border: time.hasError ? "1px solid red" : "none",
            }}
            key={`private-inspection-${time.id || index}`}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <DatePicker
                label="Date *"
                value={time.date}
                onChange={(newDate) => handleDateChange(index, newDate, true)}
                slotProps={{
                  textField: {
                    variant: "filled",
                    fullWidth: true,
                    required: true,
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
                <AccessTimeIcon />
                <Typography variant="body2">
                  Times are in 15 minute intervals:
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <Select
                label="Start Time *"
                variant="filled"
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
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              <Typography sx={{ display: "flex", alignItems: "center" }}>
                to
              </Typography>

              <Select
                label="End Time *"
                variant="filled"
                fullWidth
                value={time.end}
                onChange={(e) =>
                  handleTimeChange(index, "end", e.target.value as string, true)
                }
                sx={{ flex: 1 }}
                error={time.hasError}
              >
                {TIME_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>

              <Tooltip title="Remove">
                <IconButton
                  onClick={() => removeTime(index, true)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            {time.hasError && (
              <FormHelperText error>{time.errorMessage}</FormHelperText>
            )}
          </Paper>
        ))}

        <Button
          variant="outlined"
          onClick={addPrivateInspectionTime}
          sx={{ mt: 2 }}
          onMouseUp={() => setTimeout(() => updateZustandInspections(), 50)}
        >
          Add a private inspection time
        </Button>

        {/* Manual sync button to help with debugging */}
        <Button
          variant="contained"
          color="primary"
          onClick={updateZustandInspections}
          sx={{ mt: 4, display: "none" }} // Hidden in production, enable for debugging
        >
          Save Inspections
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
