/**
 * Common formatting utility functions for the application
 */

/**
 * Formats a number as AUD currency
 * @param amount The number to format as currency
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

/**
 * Converts 24-hour time format to 12-hour format with AM/PM
 * @param time24h Time string in 24-hour format (HH:MM)
 * @returns Time string in 12-hour format with AM/PM
 */
export const formatTimeDisplay = (time24h: string): string => {
  const [hours, minutes] = time24h.split(":");
  const hoursNum = Number.parseInt(hours, 10);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const hours12 = hoursNum % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

/**
 * Formats database time string (HH:MM:SS) to UI format (HH:MM)
 * @param timeStr Time string from database
 * @returns Formatted time string (HH:MM)
 */
export const formatDbTime = (timeStr: string): string => {
  return timeStr ? timeStr.substring(0, 5) : "09:00"; // HH:MM format
};

/**
 * Extracts the filename from a storage URL
 * @param url The full storage URL
 * @returns The extracted filename
 */
export const getFilenameFromUrl = (url: string | null): string => {
  if (!url) return "";
  try {
    // Extract the filename from the URL path
    const urlParts = url.split("/");
    const filenameWithId = urlParts[urlParts.length - 1];

    // Extract just the filename portion after the UUID
    const parts = filenameWithId.split("-");
    if (parts.length > 1) {
      // Return everything after the first dash
      return parts.slice(1).join("-");
    }
    return filenameWithId;
  } catch (error) {
    console.error("Error parsing filename from URL:", error);
    return "Document";
  }
};

/**
 * Generates time options in 15-minute intervals for time pickers
 * @returns Array of time strings in 24-hour format
 */
export const generateTimeOptions = (): string[] => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hourStr = hour.toString().padStart(2, "0");
      const minuteStr = minute.toString().padStart(2, "0");
      options.push(`${hourStr}:${minuteStr}`);
    }
  }
  return options;
};

/**
 * Finds the next time option after the given time
 * @param time Current time string in 24-hour format (HH:MM)
 * @returns Next time option in 15-minute intervals
 */
export const getNextTimeOption = (time: string): string => {
  const timeOptions = generateTimeOptions();
  const index = timeOptions.indexOf(time);
  if (index === -1 || index === timeOptions.length - 1) {
    // If time not found or is last option, return 15 minutes later
    const [hours, minutes] = time.split(":").map(Number);
    let newMinutes = minutes + 15;
    let newHours = hours;

    if (newMinutes >= 60) {
      newMinutes = 0;
      newHours = (newHours + 1) % 24;
    }

    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`;
  }

  return timeOptions[index + 1];
};
