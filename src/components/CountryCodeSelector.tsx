import {
  Box,
  ListItemIcon,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

// Common country codes with flags
const countries = [
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "NZ", dialCode: "+64", name: "New Zealand", flag: "🇳🇿" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "CN", dialCode: "+86", name: "China", flag: "🇨🇳" },
  { code: "HK", dialCode: "+852", name: "Hong Kong", flag: "🇭🇰" },
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "ID", dialCode: "+62", name: "Indonesia", flag: "🇮🇩" },
  { code: "JP", dialCode: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "MY", dialCode: "+60", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "TH", dialCode: "+66", name: "Thailand", flag: "🇹🇭" },
  { code: "VN", dialCode: "+84", name: "Vietnam", flag: "🇻🇳" },
  { code: "PH", dialCode: "+63", name: "Philippines", flag: "🇵🇭" },
  { code: "KR", dialCode: "+82", name: "South Korea", flag: "🇰🇷" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dialCode: "+33", name: "France", flag: "🇫🇷" },
  { code: "IT", dialCode: "+39", name: "Italy", flag: "🇮🇹" },
  { code: "NL", dialCode: "+31", name: "Netherlands", flag: "🇳🇱" },
  { code: "ES", dialCode: "+34", name: "Spain", flag: "🇪🇸" },
];

interface CountryCodeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function CountryCodeSelector({
  value,
  onChange,
  disabled = false,
}: CountryCodeSelectorProps) {
  // Find the selected country by dial code, defaulting to Australia
  const selectedCountry = useMemo(() => {
    if (!value) return countries[0]; // Default to Australia

    // If the value is just the plus code, find by dial code
    const dialCode = value.startsWith("+") ? value : `+${value}`;
    return (
      countries.find((country) => country.dialCode === dialCode) || countries[0]
    );
  }, [value]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    onChange(event.target.value);
  };

  return (
    <Select
      value={selectedCountry.dialCode}
      onChange={handleChange}
      disabled={disabled}
      sx={{
        width: 110,
        "& .MuiSelect-select": {
          display: "flex",
          alignItems: "center",
          paddingY: 1.5,
        },
      }}
      MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 300,
          },
        },
      }}
    >
      {countries.map((country) => (
        <MenuItem
          key={`${country.code}-${country.dialCode}`}
          value={country.dialCode}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Typography variant="body1" fontSize="1.2rem">
                {country.flag}
              </Typography>
            </ListItemIcon>
            <Typography>
              {country.dialCode} {country.code}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
