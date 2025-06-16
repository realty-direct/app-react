import {
  AccountCircle,
  Badge,
  Delete,
  Email,
  Phone,
  VerifiedUser,
} from "@mui/icons-material";
import {
  Alert,
  type AlertColor,
  AlertTitle,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import PhoneVerification from "../components/PhoneVerification";
import { supabase } from "../database/supabase";
import useRealtyStore from "../store/store";

export default function AccountManagement() {
  const { profile, setProfile, clearSession } = useRealtyStore();
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone_number || "");

  // UI state
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Form validation state
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    phone?: string;
  }>({});

  // Show snackbar message
  const showMessage = (message: string, severity: AlertColor = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      phone?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Basic phone validation
    if (phone && !/^\+?[0-9\s()-]{8,15}$/.test(phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle phone verification success
  const handlePhoneVerificationSuccess = () => {
    // Update local profile state to show phone as verified
    if (profile) {
      setProfile({
        ...profile,
        phone_confirmed: true,
      });

      // Show success message
      showMessage("Phone number verified successfully!", "success");
    }
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Check if phone number changed
      const phoneChanged = phone !== profile?.phone_number;

      // If phone changed, reset verification status
      const updates = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        // Only reset verification if phone changed
        ...(phoneChanged && { phone_confirmed: false }),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile?.id);

      if (error) {
        throw new Error(`Error updating profile: ${error.message}`);
      }

      // Update local store
      setProfile({
        ...profile!,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone,
        // Only reset verification if phone changed
        ...(phoneChanged && { phone_confirmed: false }),
      });

      showMessage("Profile updated successfully", "success");

      // Show verification prompt if phone number changed
      if (phoneChanged) {
        showMessage(
          "Your phone number has changed and will need to be verified",
          "info"
        );
      }
    } catch (error: any) {
      showMessage(error.message || "Failed to update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // Open delete account confirmation dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setDeleteConfirmText("");
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Delete Account after confirmation
  const handleDeleteConfirmed = async () => {
    if (!profile?.id) {
      showMessage("Error: No user found", "error");
      return;
    }

    if (deleteConfirmText !== "DELETE") {
      showMessage("Please type DELETE to confirm account deletion", "error");
      return;
    }

    setIsDeleting(true);

    try {
      // Step 1: Delete the user's profile from `profiles` table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile.id);

      if (profileError) {
        throw new Error(`Failed to delete profile: ${profileError.message}`);
      }

      // Step 2: Delete the user from Supabase authentication (Requires Admin Role)
      const { error: userError } = await supabase.auth.admin.deleteUser(
        profile.id
      );

      if (userError) {
        throw new Error(`Failed to delete user: ${userError.message}`);
      }

      // Step 3: Clear Zustand Session & Redirect
      clearSession();
      navigate("/signin");
    } catch (error: any) {
      showMessage(error.message || "An unknown error occurred", "error");
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  if (!profile) {
    return <LoadingSpinner fullPage text="Loading your profile..." />;
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        mb={4}
      >
        Account Management
      </Typography>

      {/* Profile Information Card */}
      <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 80,
              height: 80,
              fontSize: "2rem",
              mr: 3,
            }}
          >
            {firstName
              ? firstName[0].toUpperCase()
              : profile.email?.[0].toUpperCase() || "U"}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {firstName || profile.first_name} {lastName || profile.last_name}
            </Typography>
            <Typography color="text.secondary">{profile.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" fontWeight="medium" sx={{ mb: 3 }}>
          Personal Information
        </Typography>

        {/* Phone verification status banner */}
        {profile &&
          (profile.phone_confirmed ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Phone Verified</AlertTitle>
              Your phone number is verified and you can access all features that
              require phone verification.
            </Alert>
          ) : (
            <Alert severity="info" sx={{ mb: 3 }}>
              <AlertTitle>Phone Verification Required</AlertTitle>
              Verifying your phone number allows you to use features like
              signboards and other property services.
            </Alert>
          ))}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.firstName) {
                  setErrors({ ...errors, firstName: undefined });
                }
              }}
              fullWidth
              disabled={loading}
              error={!!errors.firstName}
              helperText={errors.firstName}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 6 }}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.lastName) {
                  setErrors({ ...errors, lastName: undefined });
                }
              }}
              fullWidth
              disabled={loading}
              error={!!errors.lastName}
              helperText={errors.lastName}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Email Address"
              value={profile?.email}
              fullWidth
              disabled
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              label="Phone Number"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) {
                  setErrors({ ...errors, phone: undefined });
                }
              }}
              fullWidth
              disabled={loading}
              error={!!errors.phone}
              helperText={errors.phone}
              placeholder="e.g., +61 400 123 456"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
                endAdornment: profile?.phone_confirmed ? (
                  <InputAdornment position="end">
                    <Tooltip title="Phone number verified">
                      <VerifiedUser color="success" />
                    </Tooltip>
                  </InputAdornment>
                ) : undefined,
              }}
            />

            {/* Phone verification button - show only if phone isn't verified */}
            {profile && !profile.phone_confirmed && phone && (
              <Box sx={{ mt: 1 }}>
                <PhoneVerification
                  userId={profile.id}
                  phoneNumber={phone}
                  buttonText="Verify Phone Number"
                  buttonVariant="text"
                  onSuccess={handlePhoneVerificationSuccess}
                />
              </Box>
            )}
          </Grid>
          <Grid size={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateProfile}
              disabled={loading || isDeleting}
              fullWidth
              sx={{ py: 1.5 }}
            >
              {loading ? (
                <LoadingSpinner buttonMode text="Updating..." />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Danger Zone Card */}
      <Paper elevation={3} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
        <Typography
          variant="h6"
          fontWeight="medium"
          sx={{
            mb: 3,
            color: "error.main",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Delete sx={{ mr: 1 }} />
          Danger Zone
        </Typography>

        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Warning</AlertTitle>
          Deleting your account is permanent and cannot be undone. All your
          properties, photos, and personal information will be permanently
          removed from our system.
        </Alert>

        <Button
          variant="outlined"
          color="error"
          onClick={handleOpenDeleteDialog}
          disabled={loading || isDeleting}
          fullWidth
          startIcon={<Delete />}
          sx={{ py: 1.5 }}
        >
          Delete Account
        </Button>
      </Paper>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="delete-dialog-title" color="error" sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Delete sx={{ mr: 1 }} />
            Delete Account?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            <Typography paragraph>
              Are you sure you want to delete your account? This action cannot
              be undone and all your data will be permanently deleted,
              including:
            </Typography>
            <ul>
              <li>Your personal profile information</li>
              <li>All property listings and their associated media</li>
              <li>
                Inspection schedules, signboard orders, and other service
                records
              </li>
              <li>Your account credentials and login information</li>
            </ul>
            <Typography sx={{ fontWeight: "bold", mt: 2 }}>
              Please type "DELETE" below to confirm.
            </Typography>
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="delete-confirmation"
            label="Type DELETE to confirm"
            fullWidth
            variant="outlined"
            disabled={isDeleting}
            sx={{ mt: 2 }}
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            error={deleteConfirmText !== "" && deleteConfirmText !== "DELETE"}
            helperText={
              deleteConfirmText !== "" && deleteConfirmText !== "DELETE"
                ? "Please type DELETE in all caps"
                : ""
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirmed}
            color="error"
            variant="contained"
            disabled={isDeleting || deleteConfirmText !== "DELETE"}
            startIcon={isDeleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Full-page loading overlay */}
      {isDeleting && (
        <LoadingSpinner fullPage text="Deleting your account..." />
      )}
    </Box>
  );
}
