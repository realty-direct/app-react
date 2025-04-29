// src/test/store/details.slice.test.ts
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { StoreApi } from "zustand";
import { createPropertyDetailsSlice } from "../../store/slices/details.slice";
import type { PropertyDetailsState } from "../../store/types";

describe("Property Details Slice", () => {
  // Setup test environment before each test
  let set: ReturnType<typeof vi.fn>;
  let get: ReturnType<typeof vi.fn>;
  let mockStore: StoreApi<PropertyDetailsState>;
  let slice: ReturnType<typeof createPropertyDetailsSlice>;

  beforeEach(() => {
    // Reset mocks before each test
    set = vi.fn();
    get = vi.fn();
    mockStore = {} as StoreApi<PropertyDetailsState>;
    slice = createPropertyDetailsSlice(set, get, mockStore);
  });

  test("updatePropertyDetail updates a property correctly", () => {
    // Call the function we're testing
    slice.updatePropertyDetail("property-123", { price: 500000 });

    // Check if set was called
    expect(set).toHaveBeenCalledTimes(1);

    // Extract the transformer function that was passed to set
    const transformFn = set.mock.calls[0][0];

    // Create a mock state
    const mockState = {
      propertyDetails: [{ property_id: "property-123", price: 300000 }],
    };

    // Apply the transformer to our mock state
    const newState = transformFn(mockState);

    // Check that it produced the correct result
    expect(newState.propertyDetails[0].price).toBe(500000);
  });

  test("updateImageOrder updates images and sets main image", () => {
    const images = [{ url: "image1.jpg" }, { url: "image2.jpg" }];

    // Reset the set mock to ensure clean call count
    set.mockReset();

    // Call updateImageOrder
    slice.updateImageOrder("property-123", images);

    // Verify set was called exactly once
    expect(set).toHaveBeenCalledTimes(1);

    // Extract the transform function
    const transformFn = set.mock.calls[0][0];

    // Create a mock state
    const mockState = {
      propertyDetails: [
        {
          property_id: "property-123",
          images: [{ url: "old.jpg" }],
          main_image: "old.jpg",
        },
      ],
    };

    // Apply the transformer to our mock state
    const newState = transformFn(mockState);

    // Check that it produced the correct result
    expect(newState.propertyDetails[0].images).toEqual(images);
    expect(newState.propertyDetails[0].main_image).toBe("image1.jpg");
  });
});
