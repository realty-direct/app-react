// src/test/store/inspections.slice.test.ts
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { StoreApi } from "zustand";
import { createPropertyInspectionsSlice } from "../../store/slices/inspections.slice";
import type { PropertyInspectionsState } from "../../store/types";

// Mock the database functions
vi.mock("../../database/inspections", () => ({
  createPropertyInspection: vi.fn().mockResolvedValue({
    id: "db-generated-id",
    property_id: "property-123",
    inspection_date: "2025-05-01",
    start_time: "10:00",
    end_time: "11:00",
    inspection_type: "public",
  }),
  deletePropertyInspection: vi.fn().mockResolvedValue(true),
}));

describe("Property Inspections Slice", () => {
  let set: ReturnType<typeof vi.fn>;
  let get: ReturnType<typeof vi.fn>;
  let mockStore: StoreApi<PropertyInspectionsState>;
  let slice: ReturnType<typeof createPropertyInspectionsSlice>;

  beforeEach(() => {
    // Reset mocks before each test
    set = vi.fn();
    get = vi.fn();
    mockStore = {} as StoreApi<PropertyInspectionsState>;
  });

  test("setPropertyInspections sets inspections with uniqueness check", () => {
    slice = createPropertyInspectionsSlice(set, get, mockStore);

    const inspections = [
      {
        id: "1",
        property_id: "property-123",
        inspection_date: "2025-05-01",
        start_time: "10:00",
        end_time: "11:00",
        inspection_type: "public",
      },
      {
        id: "2",
        property_id: "property-123",
        inspection_date: "2025-05-01",
        start_time: "14:00",
        end_time: "15:00",
        inspection_type: "private",
      },
    ];

    slice.setPropertyInspections(inspections);

    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({ propertyInspections: inspections });
  });

  test("clearPropertyInspections resets inspections array", () => {
    slice = createPropertyInspectionsSlice(set, get, mockStore);

    slice.clearPropertyInspections();

    expect(set).toHaveBeenCalledTimes(1);
    expect(set).toHaveBeenCalledWith({ propertyInspections: [] });
  });

  test("addPropertyInspection adds inspection optimistically then updates after db save", async () => {
    // Mock Date.now for predictable temporary IDs
    const originalDateNow = Date.now;
    Date.now = vi.fn(() => 1234567890);

    // Setup store slice
    slice = createPropertyInspectionsSlice(set, get, mockStore);

    // New inspection to add
    const newInspection = {
      property_id: "property-123",
      inspection_date: "2025-05-01",
      start_time: "10:00",
      end_time: "11:00",
      inspection_type: "public",
    };

    // Prepare state for optimistic update test
    const initialState: {
      propertyInspections: Array<{
        id: string;
        property_id: string;
        inspection_date: string;
        start_time: string;
        end_time: string;
        inspection_type: string;
      }>;
    } = { propertyInspections: [] };
    set.mockImplementation((updater) => {
      if (typeof updater === "function") {
        Object.assign(initialState, updater(initialState));
      } else {
        Object.assign(initialState, updater);
      }
      return initialState;
    });

    // Mock get to return our managed state
    get.mockImplementation(() => initialState);

    // Call the action
    await slice.addPropertyInspection(newInspection);

    // Verify it was called twice:
    // 1. For optimistic update with temp ID
    // 2. For the real update with DB ID
    expect(set).toHaveBeenCalledTimes(2);

    // Check the final state - should contain the inspection with the real ID
    expect(initialState.propertyInspections).toHaveLength(1);
    expect(initialState.propertyInspections[0]?.id).toBe("db-generated-id");

    // Restore original Date.now
    Date.now = originalDateNow;
  });

  test("deletePropertyInspection removes inspection optimistically", async () => {
    // Setup store slice
    slice = createPropertyInspectionsSlice(set, get, mockStore);

    // Initial state with an inspection
    const initialState = {
      propertyInspections: [
        {
          id: "inspection-1",
          property_id: "property-123",
          inspection_date: "2025-05-01",
          start_time: "10:00",
          end_time: "11:00",
          inspection_type: "public",
        },
      ],
    };

    // Mock set to update our state
    set.mockImplementation((updater) => {
      if (typeof updater === "function") {
        Object.assign(initialState, updater(initialState));
      } else {
        Object.assign(initialState, updater);
      }
      return initialState;
    });

    // Call the action
    await slice.deletePropertyInspection("inspection-1");

    // Verify set was called
    expect(set).toHaveBeenCalledTimes(1);

    // The inspection should be removed optimistically
    expect(initialState.propertyInspections).toHaveLength(0);
  });
});
