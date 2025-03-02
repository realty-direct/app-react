import {
  Alert,
  type AlertColor,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
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

  // ✅ Update User Profile
  const handleUpdateProfile = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase
      .from("profiles")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", profile?.id);

    if (error) {
      setMessage(`Error updating profile: ${error.message}`);
      setAlertType("error");
    } else {
      setProfile({
        id: profile?.id ?? "",
        first_name: firstName,
        last_name: lastName,
        email: profile?.email ?? "",
      });
      setMessage("Profile updated successfully.");
      setAlertType("success");
    }

    setLoading(false);
  };

  // ✅ Delete Account
  const handleDeleteAccount = async () => {
    if (!profile?.id) {
      setMessage("Error: No user found.");
      setAlertType("error");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // ✅ Step 1: Delete the user's profile from `profiles` table
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", profile.id);

      if (profileError) {
        throw new Error(`Failed to delete profile: ${profileError.message}`);
      }

      // ✅ Step 2: Delete the user from Supabase authentication (Requires Admin Role)
      const { error: userError } = await supabase.auth.admin.deleteUser(
        profile.id
      );

      if (userError) {
        throw new Error(`Failed to delete user: ${userError.message}`);
      }

      // ✅ Step 3: Clear Zustand Session & Redirect
      clearSession();
      setMessage("Account deleted successfully.");
      setAlertType("success");
      navigate("/signin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`${error.message}`);
        setAlertType("error");
      } else {
        setMessage("An unknown error occurred.");
        setAlertType("error");
      }
    } finally {
      setLoading(false);
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

      {/* ✅ Alert Section */}
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

      {/* ✅ Profile Update Section */}
      <Stack spacing={2}>
        <TextField
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          fullWidth
        />
        <TextField label="Email" value={profile?.email} disabled fullWidth />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfile}
          disabled={loading}
          fullWidth
        >
          Update Profile
        </Button>

        <Divider sx={{ my: 2 }} />

        {/* ✅ Delete Account */}
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteAccount}
          disabled={loading}
          fullWidth
        >
          Delete Account
        </Button>
      </Stack>
    </Box>
  );
}
