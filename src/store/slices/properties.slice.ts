import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
import type { PropertiesState, Property } from "../types";

export const createPropertiesSlice: StateCreator<PropertiesState> = (set) => ({
  properties: [],

  setProperties: (properties) => set({ properties }),

  clearProperties: () => set({ properties: [] }),

  fetchUserProperties: async (userId: string) => {
    try {
      const { data: properties, error } = await supabase
        .from("properties")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching properties:", error);
        return;
      }

      set({ properties });
    } catch (error) {
      console.error("fetchUserProperties error:", error);
    }
  },

  addProperty: async (newProperty: Omit<Property, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .insert([newProperty])
        .select("id, created_at")
        .single();

      if (error) {
        console.error("Error adding property:", error);
        return null;
      }

      const newPropertyWithId: Property = {
        id: data.id,
        created_at: data.created_at,
        ...newProperty,
      };

      set((state) => ({
        properties: [...state.properties, newPropertyWithId],
      }));

      return data.id;
    } catch (error) {
      console.error("addProperty error:", error);
      return null;
    }
  },

  deleteProperty: async (id: string) => {
    try {
      const { error } = await supabase
        .from("properties")
        .delete()
        .match({ id });

      if (error) {
        console.error("Error deleting property:", error);
        return;
      }

      set((state) => ({
        properties: state.properties.filter((property) => property.id !== id),
      }));
    } catch (error) {
      console.error("deleteProperty error:", error);
    }
  },
});
