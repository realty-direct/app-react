import { TextField } from "@mui/material";
import type { JSX } from "react";

interface RealtyFormInputProps {
  id: string;
  label: string;
  type: string;
  required: boolean;
  autoComplete: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  helperText?: string;
}

export default function RealtyFormInput({
  id,
  label,
  type,
  required,
  autoComplete,
  value,
  onChange,
  error,
  helperText,
}: RealtyFormInputProps): JSX.Element {
  return (
    <TextField
      id={id}
      name={id}
      label={label}
      type={type}
      required={required}
      autoComplete={autoComplete}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      fullWidth
      size="small"
      sx={{ mt: 1 }}
    />
  );
}