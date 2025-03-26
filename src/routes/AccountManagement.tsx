import {
  Alert,
  type AlertColor,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { supabase } from "../database/supabase";
import useRealtyStore from "../store/store";

export default function AccountManagement() {
  const { profile, setProfile, clearSession } = useRealtyStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<AlertColor>("info");

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update User Profile
  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ first_name: firstName, last_name: lastName })
        .eq("id", profile?.id);

      if (error) {
        throw new Error(`Error updating profile: ${error.message}`);
      }

      setProfile({
        id: profile?.id ?? "",
        first_name: firstName,
        last_name: lastName,
        email: profile?.email ?? "",
      });

      setMessage("Profile updated successfully.");
      setAlertType("success");
    } catch (error: any) {
      setMessage(error.message || "Failed to update profile.");
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  // Open delete account confirmation dialog
  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Delete Account after confirmation
  const handleDeleteConfirmed = async () => {
    if (!profile?.id) {
      setMessage("Error: No user found.");
      setAlertType("error");
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
      setMessage(error.message || "An unknown error occurred.");
      setAlertType("error");
      setIsDeleting(false);
      handleCloseDeleteDialog();
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Account Management
      </Typography>

      {/* Alert Section */}
      {message && (
        <Alert
          severity={alertType}
          sx={{
            mb: 2,
            bgcolor: alertType === "success" ? "success.dark" : undefined,
            color: alertType === "success" ? "white" : undefined,
          }}
        >
          {message}
        </Alert>
      )}

      {/* Profile Update Section */}
      <Stack spacing={2}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
          disabled={loading || isDeleting}
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
          disabled={loading || isDeleting}
        />
        <TextField label="Email" value={profile?.email} disabled fullWidth />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfile}
          disabled={loading || isDeleting}
          fullWidth
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <title>Loading</title>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Updating...
            </div>
          ) : (
            "Update Profile"
          )}
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* Delete Account Button */}
        <Button
          variant="contained"
          color="error"
          onClick={handleOpenDeleteDialog}
          disabled={loading || isDeleting}
          fullWidth
        >
          Delete Account
        </Button>
      </Stack>

      {/* Delete Account Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Account?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete your account? This action cannot be
            undone. All your property listings and data will be permanently
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Loading</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Deleting...
              </div>
            ) : (
              "Delete Account"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Loading overlays */}
      {loading && (
        <LoadingSpinner fullPage text="Updating your profile..." transparent />
      )}
      {isDeleting && (
        <LoadingSpinner fullPage text="Deleting your account..." />
      )}
    </Box>
  );
}
