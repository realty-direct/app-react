import {
  AccountCircle,
  Badge,
  Email,
  Info,
  Lock,
  Phone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Modal,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CountryCodeSelector from "../components/CountryCodeSelector";
import LoadingSpinner from "../components/LoadingSpinner";
import { resendConfirmationEmail, signUp } from "../database/auth";

// Password validation helpers
const hasMinLength = (password: string) => password.length >= 8;
const hasUpperCase = (password: string) => /[A-Z]/.test(password);
const hasLowerCase = (password: string) => /[a-z]/.test(password);
const hasNumber = (password: string) => /\d/.test(password);
const hasSpecialChar = (password: string) =>
  /[!@#$%^&*(),.?":{}|<>]/.test(password);

export default function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+61"); // Default to Australia
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Error handling
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  // Password strength feedback
  const passwordRequirements = [
    { validator: hasMinLength, text: "At least 8 characters" },
    { validator: hasUpperCase, text: "At least one uppercase letter" },
    { validator: hasLowerCase, text: "At least one lowercase letter" },
    { validator: hasNumber, text: "At least one number" },
    { validator: hasSpecialChar, text: "At least one special character" },
  ];

  const getPasswordStrength = () => {
    if (!password) return 0;

    const passedChecks = passwordRequirements.filter((req) =>
      req.validator(password)
    ).length;

    return (passedChecks / passwordRequirements.length) * 100;
  };

  const passwordStrength = getPasswordStrength();

  const getStrengthColor = () => {
    if (passwordStrength < 40) return theme.palette.error.main;
    if (passwordStrength < 80) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phoneNumber?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
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

    // Phone validation
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else {
      // Basic format validation
      if (!/^[0-9\s()-]{6,15}$/.test(phoneNumber.replace(/\s+/g, ""))) {
        newErrors.phoneNumber = "Please enter a valid phone number";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength < 80) {
      newErrors.password = "Password doesn't meet all requirements";
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms acceptance
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Format phone for submission (E.164)
  const formatPhone = (): string => {
    // Remove all non-digit characters
    let formatted = phoneNumber.replace(/\D/g, "");

    // Add country code
    if (countryCode) {
      const cleanCountryCode = countryCode.startsWith("+")
        ? countryCode
        : `+${countryCode}`;

      return `${cleanCountryCode}${formatted}`;
    }

    return `+61${formatted}`; // Default to Australia if no country code
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
      const formattedPhone = formatPhone();

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
        setLoading(false);
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
          elevation={4}
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
              style={{ height: 48, width: "auto", margin: "0 auto" }}
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
              <Grid size={{ xs: 12, sm: 6 }}>
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
              <Grid size={{ xs: 12, sm: 6 }}>
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
              <Grid size={12}>
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

              {/* Phone field with country code */}
              <Grid size={12}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <CountryCodeSelector
                    value={countryCode}
                    onChange={setCountryCode}
                    disabled={loading}
                  />
                  <TextField
                    label="Phone Number"
                    fullWidth
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    error={!!errors.phoneNumber}
                    helperText={
                      errors.phoneNumber ||
                      "Without country code (e.g., 400 123 456)"
                    }
                    disabled={loading}
                    required
                    placeholder="Enter your phone number"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Password fields */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
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
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Password Strength Indicator */}
              {password && (
                <Grid size={12}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Password Strength
                    </Typography>
                    <Box
                      sx={{
                        width: "100%",
                        height: 8,
                        bgcolor: "grey.200",
                        borderRadius: 5,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${passwordStrength}%`,
                          height: "100%",
                          bgcolor: getStrengthColor(),
                          borderRadius: 5,
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{ mt: 1, gap: 0.5 }}
                    >
                      {passwordRequirements.map((req, index) => (
                        <Typography
                          key={index}
                          variant="caption"
                          sx={{
                            color: req.validator(password)
                              ? theme.palette.success.main
                              : theme.palette.text.secondary,
                            display: "flex",
                            alignItems: "center",
                            mr: 2,
                          }}
                        >
                          {req.validator(password) ? "✓" : "○"} {req.text}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </Grid>
              )}

              {/* Terms and Conditions */}
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      color="primary"
                      disabled={loading}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <Link component={RouterLink} to="/terms">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link component={RouterLink} to="/privacy">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {errors.terms && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ ml: 3, display: "block" }}
                  >
                    {errors.terms}
                  </Typography>
                )}
              </Grid>

              {/* Submit button */}
              <Grid size={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                  }}
                >
                  {loading ? (
                    <LoadingSpinner buttonMode text="Creating Account..." />
                  ) : (
                    "Create Account"
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
                component={RouterLink}
                to="/signin"
                variant="text"
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
      <Modal
        open={showModal}
        onClose={() => navigate("/signin")}
        aria-labelledby="confirmation-modal-title"
      >
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
            id="confirmation-modal-title"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <Info color="info" sx={{ mr: 1 }} />
            Verification Required
          </Typography>

          <Stepper activeStep={0} orientation="vertical" sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Email Verification</StepLabel>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1, ml: 3 }}
              >
                We've sent a verification email to <strong>{email}</strong>.
                Please check your inbox and click the verification link.
              </Typography>
            </Step>
            <Step>
              <StepLabel>Sign In</StepLabel>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1, ml: 3 }}
              >
                After verification, you'll be able to sign in to your account.
              </Typography>
            </Step>
            <Step>
              <StepLabel>Phone Verification</StepLabel>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", mt: 1, ml: 3 }}
              >
                Once signed in, you'll need to verify your phone number to
                access all features.
              </Typography>
            </Step>
          </Stepper>

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
