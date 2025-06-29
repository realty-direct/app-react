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
import { useParams } from "react-router-dom";
import useRealtyStore from "../../store/store";
import {
  formatDbTime,
  formatTimeDisplay,
  generateTimeOptions,
  getNextTimeOption,
} from "../../utils/formatters";

const TIME_OPTIONS = generateTimeOptions();

export default function Inspections() {
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const propertyId = id ?? "";

  const {
    propertyInspections,
    addPropertyInspection,
    updatePropertyInspection,
    deletePropertyInspection,
  } = useRealtyStore();

  const openHouseInspections = propertyInspections.filter(
    (insp) =>
      insp.property_id === propertyId && insp.inspection_type === "public"
  );

  const privateInspections = propertyInspections.filter(
    (insp) =>
      insp.property_id === propertyId && insp.inspection_type === "private"
  );

  const handleAddOpenHouse = () => {
    addPropertyInspection({
      property_id: propertyId,
      inspection_date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      end_time: "10:00",
      inspection_type: "public",
    });
  };

  const handleAddPrivate = () => {
    addPropertyInspection({
      property_id: propertyId,
      inspection_date: new Date().toISOString().split("T")[0],
      start_time: "09:00",
      end_time: "10:00",
      inspection_type: "private",
    });
  };

  const handleDateChange = (inspectionId: string, newDate: Date | null) => {
    if (!newDate) return;

    const formattedDate = newDate.toISOString().split("T")[0];

    updatePropertyInspection(inspectionId, {
      inspection_date: formattedDate,
    });
  };

  const handleTimeChange = (
    inspectionId: string,
    field: "start_time" | "end_time",
    value: string,
    currentStartTime: string,
    currentEndTime: string
  ) => {
    const formattedCurrentStartTime = formatDbTime(currentStartTime);
    const formattedCurrentEndTime = formatDbTime(currentEndTime);

    if (field === "start_time" && value >= formattedCurrentEndTime) {
      const newEndTime = getNextTimeOption(value);

      updatePropertyInspection(inspectionId, {
        start_time: value,
        end_time: newEndTime,
      });
    }
    else if (field === "end_time" && value <= formattedCurrentStartTime) {
      return;
    } else {
      updatePropertyInspection(inspectionId, {
        [field]: value,
      });
    }
  };

  const handleDeleteInspection = (inspectionId: string) => {
    deletePropertyInspection(inspectionId);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: { xs: 2, sm: 6 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Property Inspections
        </Typography>

        <Paper
          elevation={2}
          sx={{
            p: 3,
            mb: 4,
            border: `1px solid ${theme.palette.divider}`,
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

              {openHouseInspections.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, ml: 4 }}>
                  {openHouseInspections.map((inspection) => (
                    <Chip
                      key={`summary-open-${inspection.id}`}
                      label={`${format(new Date(inspection.inspection_date), "dd MMM")} · ${formatTimeDisplay(formatDbTime(inspection.start_time))} - ${formatTimeDisplay(formatDbTime(inspection.end_time))}`}
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

              {privateInspections.length > 0 ? (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, ml: 4 }}>
                  {privateInspections.map((inspection) => (
                    <Chip
                      key={`summary-private-${inspection.id}`}
                      label={`${format(new Date(inspection.inspection_date), "dd MMM")} · ${formatTimeDisplay(formatDbTime(inspection.start_time))} - ${formatTimeDisplay(formatDbTime(inspection.end_time))}`}
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

        <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <HouseIcon sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h6">Open House Inspections</Typography>
          </Box>

          <Typography sx={{ mb: 3 }}>
            Set open house times when multiple prospective buyers can view your
            property simultaneously.
          </Typography>

          {openHouseInspections.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {openHouseInspections.map((inspection) => (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    position: "relative",
                  }}
                  key={`open-house-${inspection.id}`}
                >
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
                      value={new Date(inspection.inspection_date)}
                      onChange={(newDate) =>
                        handleDateChange(inspection.id, newDate)
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
                      value={formatDbTime(inspection.start_time)}
                      onChange={(e) =>
                        handleTimeChange(
                          inspection.id,
                          "start_time",
                          e.target.value as string,
                          inspection.start_time,
                          inspection.end_time
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
                      value={formatDbTime(inspection.end_time)}
                      onChange={(e) =>
                        handleTimeChange(
                          inspection.id,
                          "end_time",
                          e.target.value as string,
                          inspection.start_time,
                          inspection.end_time
                        )
                      }
                      sx={{ flex: 1 }}
                    >
                      {TIME_OPTIONS.map((option) => (
                        <MenuItem key={`open-end-${option}`} value={option}>
                          {formatTimeDisplay(option)}
                        </MenuItem>
                      ))}
                    </Select>

                    <Tooltip title="Remove">
                      <IconButton
                        onClick={() => handleDeleteInspection(inspection.id)}
                        color="error"
                        size="medium"
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          "&:hover": {
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ fontWeight: 500 }}
                  >
                    Scheduled:{" "}
                    {format(
                      new Date(inspection.inspection_date),
                      "EEEE, MMMM d, yyyy"
                    )}{" "}
                    from{" "}
                    {formatTimeDisplay(formatDbTime(inspection.start_time))} to{" "}
                    {formatTimeDisplay(formatDbTime(inspection.end_time))}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          <Button
            variant="outlined"
            onClick={handleAddOpenHouse}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              mt: 1,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            {openHouseInspections.length > 0
              ? "Add Another Open House Time"
              : "Add Open House Time"}
          </Button>
        </Paper>

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
              borderRadius: 1,
              border: `1px solid ${theme.palette.divider}`,
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

          {privateInspections.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {privateInspections.map((inspection) => (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    mb: 2,
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 1,
                    position: "relative",
                  }}
                  key={`private-inspection-${inspection.id}`}
                >
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
                      value={new Date(inspection.inspection_date)}
                      onChange={(newDate) =>
                        handleDateChange(inspection.id, newDate)
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
                      value={formatDbTime(inspection.start_time)}
                      onChange={(e) =>
                        handleTimeChange(
                          inspection.id,
                          "start_time",
                          e.target.value as string,
                          inspection.start_time,
                          inspection.end_time
                        )
                      }
                      sx={{ flex: 1 }}
                    >
                      {TIME_OPTIONS.map((option) => (
                        <MenuItem
                          key={`private-start-${option}`}
                          value={option}
                        >
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
                      value={formatDbTime(inspection.end_time)}
                      onChange={(e) =>
                        handleTimeChange(
                          inspection.id,
                          "end_time",
                          e.target.value as string,
                          inspection.start_time,
                          inspection.end_time
                        )
                      }
                      sx={{ flex: 1 }}
                    >
                      {TIME_OPTIONS.map((option) => (
                        <MenuItem key={`private-end-${option}`} value={option}>
                          {formatTimeDisplay(option)}
                        </MenuItem>
                      ))}
                    </Select>

                    <Tooltip title="Remove">
                      <IconButton
                        onClick={() => handleDeleteInspection(inspection.id)}
                        color="error"
                        size="medium"
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          "&:hover": {
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography
                    variant="body2"
                    color="secondary.main"
                    sx={{ fontWeight: 500 }}
                  >
                    Scheduled:{" "}
                    {format(
                      new Date(inspection.inspection_date),
                      "EEEE, MMMM d, yyyy"
                    )}{" "}
                    from{" "}
                    {formatTimeDisplay(formatDbTime(inspection.start_time))} to{" "}
                    {formatTimeDisplay(formatDbTime(inspection.end_time))}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleAddPrivate}
            startIcon={<AddCircleOutlineIcon />}
            sx={{
              mt: 1,
              borderRadius: 1,
              textTransform: "none",
            }}
          >
            {privateInspections.length > 0
              ? "Add Another Private Inspection Time"
              : "Add Private Inspection Time"}
          </Button>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}
