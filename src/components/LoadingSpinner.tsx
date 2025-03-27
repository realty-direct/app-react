import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface LoadingSpinnerProps {
  size?: number;
  color?:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  text?: string;
  fullPage?: boolean;
  transparent?: boolean;
  buttonMode?: boolean; // For inline button loading
  inline?: boolean; // New prop for simpler inline loading without button styling
  thickness?: number; // Control thickness of the spinner
  delay?: number; // Optional delay before showing spinner (ms)
}

/**
 * A reusable loading spinner component that can be used throughout the application
 * to provide consistent loading indicators without causing UI flicker on quick operations.
 */
const LoadingSpinner = ({
  size = 40,
  color = "primary",
  text = "Loading...",
  fullPage = false,
  transparent = false,
  buttonMode = false,
  inline = false,
  thickness = 4,
  delay = 0,
}: LoadingSpinnerProps) => {
  // Add delayed rendering to prevent flicker for quick operations
  if (delay > 0) {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    if (!show) return null;
  }

  // Inline mode (simplest version, just the spinner)
  if (inline) {
    return <CircularProgress size={size} color={color} thickness={thickness} />;
  }

  // Button loading mode - for inline loading in buttons
  if (buttonMode) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center">
        <CircularProgress size={size / 2} color={color} thickness={thickness} />
        {text && (
          <Typography variant="button" sx={{ ml: 1 }}>
            {text}
          </Typography>
        )}
      </Box>
    );
  }

  // Standard content spinner
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <CircularProgress size={size} color={color} thickness={thickness} />
      {text && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, fontWeight: "medium" }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  // For full page overlay loading spinner
  if (fullPage) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: transparent
            ? "rgba(255, 255, 255, 0.7)"
            : "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
          backdropFilter: "blur(3px)",
        }}
      >
        {content}
      </Box>
    );
  }

  // For inline loading spinner
  return content;
};

export default LoadingSpinner;
