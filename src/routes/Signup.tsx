import {
  AccountCircle,
  Badge,
  Email,
  Info,
  Lock,
  Phone,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import { resendConfirmationEmail, signUp } from "../database/auth";

export default function Signup() {
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Error handling
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // Form validation
  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    // First name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Last name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation - must be in E.164 format for Supabase Auth
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else {
      // Convert to E.164 format if needed
      let phoneFormatted = phone;
      if (!phone.startsWith("+")) {
        // Australian default
        if (phone.startsWith("0")) {
          phoneFormatted = `+61${phone.substring(1)}`;
        } else {
          newErrors.phone =
            "Phone number must include country code (e.g., +61)";
        }
      }

      // Basic format validation
      if (
        !newErrors.phone &&
        !/^\+[0-9\s()-]{10,15}$/.test(phoneFormatted.replace(/\s+/g, ""))
      ) {
        newErrors.phone = "Please enter a valid phone number with country code";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format phone for submission (E.164)
  const formatPhone = (phoneNumber: string): string => {
    // Remove all non-digit characters except the + at the beginning
    let formatted = phoneNumber.replace(/\s+/g, "");

    // Add Australian country code if needed
    if (formatted.startsWith("0")) {
      formatted = `+61${formatted.substring(1)}`;
    } else if (!formatted.startsWith("+")) {
      formatted = `+${formatted}`;
    }

    return formatted;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Format phone to E.164 for Supabase Auth
      const formattedPhone = formatPhone(phone);

      // Call the signUp function
      const { error } = await signUp(
        email,
        password,
        firstName,
        lastName,
        formattedPhone
      );

      if (error) {
        setErrors({ general: error.message });
        return;
      }

      // Show confirmation modal
      setShowModal(true);
    } catch (err: any) {
      setErrors({
        general: err.message || "An unexpected error occurred during signup.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle resend confirmation email
  const handleResendEmail = async () => {
    setResendLoading(true);
    try {
      const { error } = await resendConfirmationEmail(email);
      if (error) {
        setErrors({ general: error.message });
      } else {
        // Update the modal message to indicate email was resent
        // This would ideally update some state to show a success message
      }
    } catch (err: any) {
      setErrors({
        general:
          err.message ||
          "Failed to resend confirmation email. Please try again.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 2,
            mx: "auto",
            width: "100%",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <img
              alt="Logo"
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-12 w-auto"
            />
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
              Create your account
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              Join our platform to start selling your properties
            </Typography>
          </Box>

          {/* General Error */}
          {errors.general && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errors.general}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Name fields */}
              <Grid md={6} sm={6} xs={12}>
                <TextField
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
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
              <Grid md={6} sm={6} xs={12}>
                <TextField
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
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

              {/* Email field */}
              <Grid xs={12}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Phone field */}
              <Grid xs={12}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={!!errors.phone}
                  helperText={
                    errors.phone ||
                    "Enter in format: +61 4xx xxx xxx or 04xx xxx xxx"
                  }
                  disabled={loading}
                  required
                  placeholder="e.g., +61 400 123 456"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password fields */}
              <Grid md={6} sm={6} xs={12}>
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid md={6} sm={6} xs={12}>
                <TextField
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Submit button */}
              <Grid xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2, py: 1.5 }}
                >
                  {loading ? (
                    <LoadingSpinner buttonMode text="Creating Account..." />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>

          <Divider sx={{ my: 3 }} />

          {/* Footer links */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/signin")}
                disabled={loading}
                sx={{ textTransform: "none" }}
              >
                Sign in
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Confirmation Modal */}
      <Modal open={showModal} onClose={() => navigate("/signin")}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <Info color="info" sx={{ mr: 1 }} />
            Verification Required
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Please check your email to confirm your account. After confirming
            your email, you'll be able to sign in and complete phone
            verification.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button onClick={() => navigate("/signin")}>Go To Sign In</Button>
            <Button
              variant="contained"
              onClick={handleResendEmail}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <LoadingSpinner buttonMode text="Resending..." />
              ) : (
                "Resend Verification"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Full page loading overlay */}
      {loading && (
        <LoadingSpinner fullPage text="Creating your account..." transparent />
      )}
    </Container>
  );
}
