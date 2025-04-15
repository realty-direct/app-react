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
    // Ensure uniqueness by property_id + enhancement_type
    const uniqueEnhancements: PropertyEnhancement[] = [];
    const uniqueKeys = new Set<string>();

    for (const enhancement of enhancements) {
      const key = `${enhancement.property_id}:${enhancement.enhancement_type}`;
      if (!uniqueKeys.has(key)) {
        uniqueKeys.add(key);
        uniqueEnhancements.push(enhancement);
      }
    }

    set({ propertyEnhancements: uniqueEnhancements });
  },

  addPropertyEnhancement: (enhancement: PropertyEnhancement) => {
    set((state) => {
      // Check if enhancement already exists for this property
      const exists = state.propertyEnhancements.some(
        (e) =>
          e.property_id === enhancement.property_id &&
          e.enhancement_type === enhancement.enhancement_type
      );

      if (exists) {
        console.warn(
          `Enhancement ${enhancement.enhancement_type} already exists for property ${enhancement.property_id}`
        );
        return { propertyEnhancements: state.propertyEnhancements };
      }

      // Add with temporary ID if none exists
      const enhancementWithId = enhancement.id
        ? enhancement
        : {
            ...enhancement,
            id: `temp-${Date.now()}-${enhancement.enhancement_type}`,
          };

      return {
        propertyEnhancements: [
          ...state.propertyEnhancements,
          enhancementWithId,
        ],
      };
    });
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
