// src/test/store/details.slice.test.ts
import { describe, expect, test, vi } from "vitest";
import type { StoreApi } from "zustand";
import { createPropertyDetailsSlice } from "../../store/slices/details.slice";
import type { PropertyDetailsState } from "../../store/types";

describe("Property Details Slice", () => {
  const set = vi.fn();
  const get = vi.fn();
  const mockStore = {} as StoreApi<PropertyDetailsState>;

  test("updatePropertyDetail updates a property correctly", () => {
    // Create the slice with mocked set/get functions and store
    const slice = createPropertyDetailsSlice(set, get, mockStore);

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
    const slice = createPropertyDetailsSlice(set, get, mockStore);
    const images = [{ url: "image1.jpg" }, { url: "image2.jpg" }];

    slice.updateImageOrder("property-123", images);

    expect(set).toHaveBeenCalledTimes(1);

    const transformFn = set.mock.calls[0][0];
    const mockState = {
      propertyDetails: [
        {
          property_id: "property-123",
          images: [{ url: "old.jpg" }],
          main_image: "old.jpg",
        },
      ],
    };

    const newState = transformFn(mockState);

    expect(newState.propertyDetails[0].images).toEqual(images);
    expect(newState.propertyDetails[0].main_image).toBe("image1.jpg");
  });
});
