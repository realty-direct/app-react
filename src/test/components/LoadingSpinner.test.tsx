// src/test/components/LoadingSpinner.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import LoadingSpinner from "../../components/LoadingSpinner";

describe("LoadingSpinner Component", () => {
  test("renders with default props", () => {
    render(<LoadingSpinner />);

    // CircularProgress should be rendered
    const spinner = document.querySelector(".MuiCircularProgress-root");
    expect(spinner).toBeInTheDocument();

    // Default text should be rendered
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("renders with custom text", () => {
    render(<LoadingSpinner text="Processing data..." />);
    expect(screen.getByText("Processing data...")).toBeInTheDocument();
  });

  test("renders in button mode", () => {
    render(<LoadingSpinner buttonMode text="Saving..." />);

    // Should render in a flex container
    const flexContainer = document.querySelector(".MuiBox-root");
    expect(flexContainer).toHaveStyle({ display: "flex" });

    // Custom text should be present
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  test("renders in fullPage mode with correct styles", () => {
    render(<LoadingSpinner fullPage text="Loading page..." />);

    // Should have fixed position styling
    const container = document.querySelector(".MuiBox-root");
    expect(container).toHaveStyle({ position: "fixed" });
    expect(container).toHaveStyle({ zIndex: 9999 });

    // Should show text
    expect(screen.getByText("Loading page...")).toBeInTheDocument();
  });

  test("respects size prop", () => {
    render(<LoadingSpinner size={60} />);

    const spinner = document.querySelector(".MuiCircularProgress-root");
    // Check if the size is applied correctly
    expect(spinner).toHaveStyle({ width: "60px", height: "60px" });
  });
});
