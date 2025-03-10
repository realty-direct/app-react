import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
import type { PropertiesState, Property } from "../types";

export const createPropertiesSlice: StateCreator<PropertiesState> = (
  set,
  get
) => ({
  properties: [],

  setProperties: (properties: Property[]) => set({ properties }),

  clearProperties: () => set({ properties: [] }),

  fetchUserProperties: async (userId: string) => {
    try {
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("❌ Error fetching properties:", error);
        return;
      }

      set({ properties });
    } catch (error) {
      console.error("❌ fetchUserProperties error:", error);
    }
  },

  addProperty: (newProperty: Property): void => {
    set((state) => ({
      properties: [...state.properties, newProperty],
    }));
  },

  deleteProperty: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("properties").delete().eq("id", id);

      if (error) {
        console.error("❌ Error deleting property:", error);
        return;
      }

      set((state) => ({
        properties: state.properties.filter((property) => property.id !== id),
      }));
    } catch (error) {
      console.error("❌ deleteProperty error:", error);
    }
  },
});
