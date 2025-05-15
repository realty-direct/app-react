import { Phone, Sms, VerifiedUser } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { startPhoneVerification, verifyPhoneOtp } from "../database/auth";
import LoadingSpinner from "./LoadingSpinner";

interface PhoneVerificationProps {
  userId: string;
  phoneNumber: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  buttonText?: string;
  buttonVariant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
}

export default function PhoneVerification({
  userId,
  phoneNumber,
  onSuccess,
  onCancel,
  buttonText = "Verify Phone Number",
  buttonVariant = "contained",
  fullWidth = false,
}: PhoneVerificationProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"request" | "verify">("request");
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleOpen = () => {
    setOpen(true);
    setError(null);
    setSuccess(null);
    setStep("request");
    setVerificationCode("");
  };

  const handleClose = () => {
    setOpen(false);
    onCancel?.();
  };

  const formatPhoneNumber = (phone: string): string => {
    const formattedPhone = phone.replace(/\s+/g, "");
    return formattedPhone.startsWith("+")
      ? formattedPhone
      : formattedPhone.startsWith("0")
        ? "+61" + formattedPhone.substring(1)
        : "+" + formattedPhone;
  };

  const handleRequestCode = async () => {
    setError(null);
    setLoading(true);

    try {
      const phoneWithPrefix = formatPhoneNumber(phoneNumber);
      const response = await startPhoneVerification(phoneWithPrefix);

      if (!response.success) {
        setError(
          response.error ||
            "Failed to send verification code. Please try again."
        );
        return;
      }

      setSuccess("Verification code sent! Please check your phone.");
      setStep("verify");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length < 6) {
      setError("Please enter a valid verification code");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const phoneWithPrefix = formatPhoneNumber(phoneNumber);
      const response = await verifyPhoneOtp(
        phoneWithPrefix,
        verificationCode,
        userId
      );

      if (!response.success) {
        setError(
          response.error || "Invalid verification code. Please try again."
        );
        return;
      }

      setSuccess("Phone number verified successfully!");

      setTimeout(() => {
        setOpen(false);
        onSuccess?.();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={buttonVariant}
        color="primary"
        onClick={handleOpen}
        startIcon={<Phone />}
        fullWidth={fullWidth}
      >
        {buttonText}
      </Button>

      <Dialog
        open={open}
        onClose={loading ? undefined : handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {step === "request"
            ? "Verify Phone Number"
            : "Enter Verification Code"}
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {step === "request" && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                We need to verify your phone number. A verification code will be
                sent to:
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: "medium", mb: 3 }}>
                {phoneNumber}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Standard message and data rates may apply.
              </Typography>
            </Box>
          )}

          {step === "verify" && (
            <Box sx={{ py: 2 }}>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please enter the 6-digit verification code sent to {phoneNumber}
              </Typography>

              <TextField
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                fullWidth
                disabled={loading}
                error={!!error}
                autoFocus
                placeholder="123456"
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" color="text.secondary">
                Didn't receive the code?{" "}
                <Button
                  variant="text"
                  onClick={handleRequestCode}
                  disabled={loading}
                  sx={{ textTransform: "none" }}
                >
                  Send again
                </Button>
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          {step === "request" ? (
            <Button
              variant="contained"
              onClick={handleRequestCode}
              disabled={loading}
              startIcon={loading ? undefined : <Sms />}
            >
              {loading ? (
                <LoadingSpinner buttonMode text="Sending..." />
              ) : (
                "Send Verification Code"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleVerifyCode}
              disabled={loading || !verificationCode}
              startIcon={loading ? undefined : <VerifiedUser />}
            >
              {loading ? (
                <LoadingSpinner buttonMode text="Verifying..." />
              ) : (
                "Verify"
              )}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}