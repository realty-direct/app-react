import type { StateCreator } from "zustand";

export type PropertyEnhancement = {
  id?: string;
  property_id: string;
  enhancement_type: string;
  price: number;
  status: "pending" | "purchased" | "completed";
  created_at?: string;
  updated_at?: string;
};

export interface PropertyEnhancementsState {
  propertyEnhancements: PropertyEnhancement[];
  setPropertyEnhancements: (enhancements: PropertyEnhancement[]) => void;
  addPropertyEnhancement: (enhancement: PropertyEnhancement) => void;
  removePropertyEnhancement: (enhancementId: string) => void;
  clearPropertyEnhancements: () => void;
  getEnhancementsForProperty: (propertyId: string) => PropertyEnhancement[];
}

export const createPropertyEnhancementsSlice: StateCreator<
  PropertyEnhancementsState
> = (set, get) => ({
  propertyEnhancements: [],

  setPropertyEnhancements: (enhancements: PropertyEnhancement[]) => {
    set({ propertyEnhancements: enhancements });
  },

  addPropertyEnhancement: (enhancement: PropertyEnhancement) => {
    set((state) => ({
      propertyEnhancements: [...state.propertyEnhancements, enhancement],
    }));
  },

  removePropertyEnhancement: (enhancementId: string) => {
    set((state) => ({
      propertyEnhancements: state.propertyEnhancements.filter(
        (enhancement) => enhancement.id !== enhancementId
      ),
    }));
  },

  clearPropertyEnhancements: () => {
    set({ propertyEnhancements: [] });
  },

  getEnhancementsForProperty: (propertyId: string) => {
    return get().propertyEnhancements.filter(
      (enhancement) => enhancement.property_id === propertyId
    );
  },
});
