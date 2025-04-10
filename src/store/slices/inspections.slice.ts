// File: src/store/slices/inspections.slice.ts
import type { StateCreator } from "zustand";
import {
  createPropertyInspection,
  deletePropertyInspection,
  updatePropertyInspection,
} from "../../database/inspections";
import type {
  Inspection,
  PropertyInspection,
  PropertyInspectionsState,
} from "../types";

export const createPropertyInspectionsSlice: StateCreator<
  PropertyInspectionsState
> = (set, get) => ({
  propertyInspections: [],

  setPropertyInspections: (inspections: Inspection[]) => {
    console.log(`Setting ${inspections.length} inspections in Zustand store`);

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
    console.log("Adding new inspection to store:", inspection);

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
        console.log("Inspection saved successfully:", savedInspection);
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
    console.log("Updating inspection:", inspectionId, updates);

    // First update the local state (optimistic update)
    set((state) => ({
      propertyInspections: state.propertyInspections.map((inspection) =>
        inspection.id === inspectionId
          ? { ...inspection, ...updates }
          : inspection
      ),
    }));

    // Then save to the database
    try {
      const updatedInspection = await updatePropertyInspection(
        inspectionId,
        updates
      );
      if (!updatedInspection) {
        console.error("Failed to update inspection in database");
      }
    } catch (error) {
      console.error("Error updating inspection:", error);
    }
  },

  // Delete an inspection
  deletePropertyInspection: async (inspectionId: string) => {
    console.log("Deleting inspection:", inspectionId);

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
    console.log("Clearing all inspections from store");
    set({ propertyInspections: [] });
  },
});
