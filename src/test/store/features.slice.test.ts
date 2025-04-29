// src/test/store/features.slice.test.ts
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { StoreApi } from "zustand";
import { createPropertyFeaturesSlice } from "../../store/slices/features.slice";
import type { PropertyFeaturesState } from "../../store/types";

describe("Property Features Slice", () => {
  let set: ReturnType<typeof vi.fn>;
  let get: ReturnType<typeof vi.fn>;
  let mockStore: StoreApi<PropertyFeaturesState>;
  let slice: ReturnType<typeof createPropertyFeaturesSlice>;

  beforeEach(() => {
    // Reset mocks before each test
    set = vi.fn();
    get = vi.fn();
    mockStore = {} as StoreApi<PropertyFeaturesState>;
    slice = createPropertyFeaturesSlice(set, get, mockStore);
  });

  test("setPropertyFeatures sets all features at once", () => {
    const features = [
      {
        id: "1",
        property_id: "property-123",
        feature_name: "Pool",
        feature_type: "outdoor",
      },
      {
        id: "2",
        property_id: "property-123",
        feature_name: "Garage",
        feature_type: "outdoor",
      },
    ];

    slice.setPropertyFeatures(features);

    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({ propertyFeatures: features });
  });

  test("clearPropertyFeatures resets features array", () => {
    slice.clearPropertyFeatures();

    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({ propertyFeatures: [] });
  });

  test("toggleFeatureSelection adds a feature when it doesn't exist", () => {
    const mockGetState = {
      propertyFeatures: [],
    };

    const feature = {
      property_id: "property-123",
      feature_name: "Pool",
      feature_type: "outdoor",
    };

    // Mock set to call the transformer function with our state
    set.mockImplementation((transformer) => {
      return transformer(mockGetState);
    });

    slice.toggleFeatureSelection("property-123", feature);

    expect(set).toHaveBeenCalledTimes(1);

    // Verify the result of the transformation
    const result = set.mock.calls[0][0](mockGetState);
    expect(result.propertyFeatures).toHaveLength(1);
    expect(result.propertyFeatures[0]).toEqual(feature);
  });

  test("toggleFeatureSelection removes a feature when it exists", () => {
    const existingFeature = {
      id: "1",
      property_id: "property-123",
      feature_name: "Pool",
      feature_type: "outdoor",
    };

    const mockGetState = {
      propertyFeatures: [existingFeature],
    };

    const feature = {
      property_id: "property-123",
      feature_name: "Pool",
      feature_type: "outdoor",
    };

    // Mock set to call the transformer function with our state
    set.mockImplementation((transformer) => {
      return transformer(mockGetState);
    });

    slice.toggleFeatureSelection("property-123", feature);

    expect(set).toHaveBeenCalledTimes(1);

    // Verify the result of the transformation
    const result = set.mock.calls[0][0](mockGetState);
    expect(result.propertyFeatures).toHaveLength(0);
  });
});
