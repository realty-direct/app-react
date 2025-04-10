import type { StateCreator } from "zustand";
import { createPropertyInspection, deletePropertyInspection, updatePropertyInspection } from "../../database/inspections";
import type { Inspection, PropertyInspection, PropertyInspectionsState } from "../types";

export const createPropertyInspectionsSlice: StateCreator<PropertyInspectionsState> = (
  set,
  get
) => ({
  propertyInspections: [],

  setPropertyInspections: (inspections: Inspection[]) => {
    set({ propertyInspections: inspections });
  },

  // Add a new inspection to the store (optimistic update)
  addPropertyInspection: async (inspection: PropertyInspection) => {
    // First update the local state (optimistic update)
    const tempId = `temp-${Date.now()}`; // Create a temporary ID for optimistic UI
    const tempInspection = { ...inspection, id: tempId };
    
    set((state) => ({
      propertyInspections: [...state.propertyInspections, tempInspection as Inspection],
    }));
    
    // Then save to the database
    const savedInspection = await createPropertyInspection(inspection);
    
    // Update the local state with the DB-saved inspection (replace the temp one)
    if (savedInspection) {
      set((state) => ({
        propertyInspections: state.propertyInspections
          .filter((insp) => insp.id !== tempId)
          .concat(savedInspection),
      }));
    }
  },

  // Update an existing inspection
  updatePropertyInspection: async (inspectionId: string, updates: Partial<Inspection>) => {
    // First update the local state (optimistic update)
    set((state) => ({
      propertyInspections: state.propertyInspections.map((inspection) =>
        inspection.id === inspectionId
          ? { ...inspection, ...updates }
          : inspection
      ),
    }));
    
    // Then save to the database
    await updatePropertyInspection(inspectionId, updates);
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
    await deletePropertyInspection(inspectionId);
  },

  // Clear all inspections from store
  clearPropertyInspections: () => {
    set({ propertyInspections: [] });
  },
});