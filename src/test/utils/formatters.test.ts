// src/test/utils/formatters.test.ts
import { describe, expect, test } from "vitest";
import {
  formatCurrency,
  formatDbTime,
  formatTimeDisplay,
  generateTimeOptions,
  getFilenameFromUrl,
  getNextTimeOption,
} from "../../utils/formatters";

describe("Formatter Functions", () => {
  describe("Currency Formatting", () => {
    test("formatCurrency formats numbers as AUD currency", () => {
      expect(formatCurrency(1000)).toBe("$1,000.00");
      expect(formatCurrency(1500.5)).toBe("$1,500.50");
      expect(formatCurrency(0)).toBe("$0.00");
    });

    test("formatCurrency handles negative values", () => {
      expect(formatCurrency(-1000)).toBe("-$1,000.00");
    });

    test("formatCurrency handles large numbers", () => {
      expect(formatCurrency(1000000)).toBe("$1,000,000.00");
    });
  });

  describe("Time Formatting", () => {
    test("formatTimeDisplay converts 24h time to 12h format", () => {
      expect(formatTimeDisplay("09:30")).toBe("9:30 AM");
      expect(formatTimeDisplay("13:45")).toBe("1:45 PM");
      expect(formatTimeDisplay("00:15")).toBe("12:15 AM");
      expect(formatTimeDisplay("23:59")).toBe("11:59 PM");
    });

    test("formatDbTime formats database time strings", () => {
      expect(formatDbTime("13:45:00")).toBe("13:45");
      expect(formatDbTime("")).toBe("09:00");
      expect(formatDbTime("09:15:30")).toBe("09:15");
    });
  });

  describe("Filename Extraction", () => {
    test("getFilenameFromUrl extracts filenames correctly", () => {
      const url1 =
        "https://example.com/storage/v1/object/public/property_photographs/123/abc123-house-photo.jpg";
      expect(getFilenameFromUrl(url1)).toBe("house-photo.jpg");

      const url2 =
        "https://example.com/storage/v1/object/public/property-floorplans/123/def456-floorplan1.png";
      expect(getFilenameFromUrl(url2)).toBe("floorplan1.png");
    });

    test("getFilenameFromUrl handles null values", () => {
      expect(getFilenameFromUrl(null)).toBe("");
    });

    test("getFilenameFromUrl handles URLs without dashes", () => {
      const url =
        "https://example.com/storage/v1/object/public/property_photographs/123/document.pdf";
      expect(getFilenameFromUrl(url)).toBe("document.pdf");
    });
  });

  describe("Time Options", () => {
    test("generateTimeOptions creates 15-minute interval options", () => {
      const options = generateTimeOptions();

      // 24 hours × 4 15-minute intervals = 96 options
      expect(options.length).toBe(96);

      // Check first option
      expect(options[0]).toBe("00:00");

      // Check some random options
      expect(options.includes("09:15")).toBe(true);
      expect(options.includes("12:30")).toBe(true);
      expect(options.includes("17:45")).toBe(true);

      // Check last option
      expect(options[95]).toBe("23:45");

      // All options should be in the format HH:MM
      const formatRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
      expect(options.every((option) => formatRegex.test(option))).toBe(true);
    });

    test("getNextTimeOption finds the next 15-minute interval", () => {
      // Regular cases
      expect(getNextTimeOption("09:00")).toBe("09:15");
      expect(getNextTimeOption("13:45")).toBe("14:00");

      // Edge cases - hour rollover
      expect(getNextTimeOption("23:45")).toBe("00:00");

      // Case when time is not in the standard options
      expect(getNextTimeOption("09:22")).toBe("09:37");
    });
  });
});
