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
import type { PropertyInspection } from "../../database/inspections";
import {
  createMultipleInspections,
  deletePropertyInspection,
} from "../../database/inspections";
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

  // Fetch inspections when component mounts
  useEffect(() => {
    const loadInspections = async () => {
      if (propertyId) {
        // Filter property inspections that match this property ID
        const currentInspections = propertyInspections.filter(
          (insp) => insp.property_id === propertyId
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
  }, [propertyId, propertyInspections]);

  // Validate time (ensure start is before end)
  const validateTimeRange = (start: string, end: string): boolean => {
    return start < end;
  };

  // Function to save inspections to DB
  const saveInspections = async () => {
    if (!propertyId) return;

    // Validate and filter out inspections with incomplete data
    const validOpenHouse = openHouseTimes.filter((t) => {
      const isValid = t.date && validateTimeRange(t.start, t.end);
      return isValid && !t.hasError;
    });

    const validPrivate = privateInspectionTimes.filter((t) => {
      const isValid = t.date && validateTimeRange(t.start, t.end);
      return isValid && !t.hasError;
    });

    // Create new inspection objects (excludes inspections with IDs which are already in the DB)
    const newOpenHouse: PropertyInspection[] = validOpenHouse
      .filter((t) => !t.id)
      .map((t) => ({
        property_id: propertyId,
        inspection_date: t.date?.toISOString().split("T")[0] || "",
        start_time: t.start,
        end_time: t.end,
        inspection_type: "open_house",
      }));

    const newPrivate: PropertyInspection[] = validPrivate
      .filter((t) => !t.id)
      .map((t) => ({
        property_id: propertyId,
        inspection_date: t.date?.toISOString().split("T")[0] || "",
        start_time: t.start,
        end_time: t.end,
        inspection_type: "private",
      }));

    // Combine all new inspections
    const newInspections = [...newOpenHouse, ...newPrivate];

    // Save to DB if we have new inspections
    if (newInspections.length > 0) {
      const savedInspections = await createMultipleInspections(newInspections);

      // Update state with saved inspections
      if (savedInspections.length > 0) {
        setPropertyInspections([
          ...propertyInspections.filter((i) => i.property_id !== propertyId),
          ...propertyInspections.filter(
            (i) =>
              i.property_id === propertyId &&
              (i.inspection_type !== "open_house" || i.id) &&
              (i.inspection_type !== "private" || i.id)
          ),
          ...savedInspections,
        ]);
      }
    }
  };

  // Save inspections when component unmounts
  useEffect(() => {
    return () => {
      saveInspections();
    };
  }, []);

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
  };

  // Handle time changes
  const handleTimeChange = (
    index: number,
    field: "start" | "end",
    value: string,
    isPrivate: boolean
  ) => {
    const times = isPrivate ? privateInspectionTimes : openHouseTimes;
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

    const updateTimes = (times: InspectionTime[]): InspectionTime[] =>
      times.map((item, i) =>
        i === index ? { ...item, [field]: value, hasError, errorMessage } : item
      );

    if (isPrivate) {
      setPrivateInspectionTimes(updateTimes(privateInspectionTimes));
    } else {
      setOpenHouseTimes(updateTimes(openHouseTimes));
    }
  };

  // Function to add new open house time
  const addOpenHouseTime = () => {
    setOpenHouseTimes([
      ...openHouseTimes,
      { date: null, start: "09:00", end: "09:15", hasError: false },
    ]);
  };

  // Function to add new private inspection time
  const addPrivateInspectionTime = () => {
    setPrivateInspectionTimes([
      ...privateInspectionTimes,
      { date: null, start: "09:00", end: "09:15", hasError: false },
    ]);
  };

  // Function to remove an entry
  const removeTime = async (index: number, isPrivate: boolean) => {
    const times = isPrivate ? privateInspectionTimes : openHouseTimes;
    const time = times[index];

    if (time.id) {
      // If the inspection has an ID, delete it from the database
      await deletePropertyInspection(time.id);
      removeInspection(time.id);
    }

    // Update local state
    const updateTimes = (items: InspectionTime[]): InspectionTime[] =>
      items.filter((_, i) => i !== index);

    if (isPrivate) {
      setPrivateInspectionTimes(updateTimes(privateInspectionTimes));
    } else {
      setOpenHouseTimes(updateTimes(openHouseTimes));
    }
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
                  handleTimeChange(index, "start", e.target.value, false)
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
                  handleTimeChange(index, "end", e.target.value, false)
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

        <Button variant="outlined" onClick={addOpenHouseTime} sx={{ mb: 3 }}>
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
                  handleTimeChange(index, "start", e.target.value, true)
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
                  handleTimeChange(index, "end", e.target.value, true)
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
        >
          Add a private inspection time
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
