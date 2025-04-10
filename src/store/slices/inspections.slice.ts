import type { StateCreator } from "zustand";
import type { PropertyInspection } from "../../database/inspections";
import {
  createPropertyInspection,
  deletePropertyInspection,
} from "../../database/inspections";
import type { Inspection, PropertyInspectionsState } from "../types";

export const createPropertyInspectionsSlice: StateCreator<
  PropertyInspectionsState
> = (set, get) => ({
  propertyInspections: [],

  setPropertyInspections: (inspections: Inspection[]) => {
    // Make sure we're not adding duplicates
    const uniqueInspections = inspections.reduce((acc, current) => {
      // If we already have this inspection by ID, don't add it again
      const existingIndex = acc.findIndex((item) => item.id === current.id);
      if (existingIndex >= 0) {
        // If it exists but the current one is newer/different, replace it
        acc[existingIndex] = current;
        return acc;
      }
      // Otherwise add the new inspection
      return [...acc, current];
    }, [] as Inspection[]);

    set({ propertyInspections: uniqueInspections });
  },

  // Add a new inspection to the store (optimistic update)
  addPropertyInspection: async (inspection: PropertyInspection) => {
    // First update the local state (optimistic update)
    const tempId = `temp-${Date.now()}`; // Create a temporary ID for optimistic UI
    const tempInspection = { ...inspection, id: tempId };

    set((state) => ({
      propertyInspections: [
        ...state.propertyInspections,
        tempInspection as Inspection,
      ],
    }));

    // Then save to the database
    try {
      const savedInspection = await createPropertyInspection(inspection);

      // Update the local state with the DB-saved inspection (replace the temp one)
      if (savedInspection) {
        set((state) => ({
          propertyInspections: state.propertyInspections
            .filter((insp) => insp.id !== tempId)
            .concat(savedInspection),
        }));
      } else {
        console.error("Failed to save inspection, removing temporary entry");
        // If save failed, remove the temporary entry
        set((state) => ({
          propertyInspections: state.propertyInspections.filter(
            (insp) => insp.id !== tempId
          ),
        }));
      }
    } catch (error) {
      console.error("Error saving inspection:", error);
      // Remove the temporary entry on error
      set((state) => ({
        propertyInspections: state.propertyInspections.filter(
          (insp) => insp.id !== tempId
        ),
      }));
    }
  },

  // Update an existing inspection
  updatePropertyInspection: async (
    inspectionId: string,
    updates: Partial<Inspection>
  ) => {
    // First update the local state (optimistic update)
    set((state) => ({
      propertyInspections: state.propertyInspections.map((inspection) =>
        inspection.id === inspectionId
          ? { ...inspection, ...updates }
          : inspection
      ),
    }));

    // We'll let the Edit.tsx handle the actual database update
  },

  // Delete an inspection
  deletePropertyInspection: async (inspectionId: string) => {
    // First update the local state (optimistic delete)
    set((state) => ({
      propertyInspections: state.propertyInspections.filter(
        (inspection) => inspection.id !== inspectionId
      ),
    }));

    // Then delete from the database
    try {
      const success = await deletePropertyInspection(inspectionId);
      if (!success) {
        console.error("Failed to delete inspection from database");
      }
    } catch (error) {
      console.error("Error deleting inspection:", error);
    }
  },

  // Clear all inspections from store
  clearPropertyInspections: () => {
    set({ propertyInspections: [] });
  },
});
