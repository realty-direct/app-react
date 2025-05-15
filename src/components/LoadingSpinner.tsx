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
  buttonMode?: boolean;
  inline?: boolean;
  thickness?: number;
  delay?: number;
}

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
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!show) return null;

  if (inline) {
    return <CircularProgress size={size} color={color} thickness={thickness} />;
  }

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

  const content = (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(18, 18, 18, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        borderRadius: 2,
        boxShadow: theme.palette.mode === 'dark'
          ? '0 8px 16px rgba(0,0,0,0.4)'
          : '0 4px 12px rgba(0,0,0,0.1)',
        border: theme.palette.mode === 'dark'
          ? '1px solid rgba(255,255,255,0.1)'
          : 'none',
        backdropFilter: 'blur(4px)',
      })}
    >
      <CircularProgress size={size} color={color} thickness={thickness} />
      {text && (
        <Typography
          variant="body2"
          sx={(theme) => ({ 
            mt: 2, 
            fontWeight: "medium",
            color: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.9)'
              : theme.palette.text.secondary
          })}
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Box
        sx={(theme) => ({
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.mode === 'dark'
            ? transparent 
              ? 'rgba(0, 0, 0, 0.75)'
              : 'rgba(0, 0, 0, 0.85)'
            : transparent
              ? 'rgba(255, 255, 255, 0.75)'
              : 'rgba(255, 255, 255, 0.9)',
          zIndex: 9999,
          backdropFilter: "blur(5px)",
        })}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default LoadingSpinner;