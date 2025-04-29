// src/test/utils/formatters.test.ts
import { describe, expect, test } from "vitest";

// Let's extract some formatting functions from your components
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(amount);
};

const formatTimeDisplay = (time24h: string) => {
  const [hours, minutes] = time24h.split(":");
  const hoursNum = Number.parseInt(hours, 10);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const hours12 = hoursNum % 12 || 12;
  return `${hours12}:${minutes} ${period}`;
};

describe("Formatter Functions", () => {
  test("formatCurrency formats numbers as AUD currency", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
    expect(formatCurrency(1500.5)).toBe("$1,500.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  test("formatTimeDisplay converts 24h time to 12h format", () => {
    expect(formatTimeDisplay("09:30")).toBe("9:30 AM");
    expect(formatTimeDisplay("13:45")).toBe("1:45 PM");
    expect(formatTimeDisplay("00:15")).toBe("12:15 AM");
    expect(formatTimeDisplay("23:59")).toBe("11:59 PM");
  });
});
