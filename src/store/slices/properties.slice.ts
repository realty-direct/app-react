import type { StateCreator } from "zustand";
import { supabase } from "../../lib/supabase";
import type { PropertiesState, Property } from "../types"; // Import types

export const createPropertiesSlice: StateCreator<
  PropertiesState,
  [],
  [],
  PropertiesState
> = (set) => ({
  properties: [],

  // ✅ Set properties manually
  setProperties: (properties) => {
    set(() => ({ properties }));
  },

  // ✅ Fetch properties from Supabase
  fetchProperties: async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("id, name, title, price, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      set(() => ({ properties: data as Property[] })); // ✅ Type-safe update
    }
  },

  // ✅ Add a new property
  addProperty: async (newProperty: Omit<Property, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("properties")
      .insert([newProperty])
      .select("*");

    if (error) {
      console.error("Error adding property:", error);
    } else if (data) {
      set((state) => ({
        properties: [...state.properties, data[0] as Property],
      }));
    }
  },

  // ✅ Delete a property
  deleteProperty: async (id: string) => {
    const { error } = await supabase.from("properties").delete().match({ id });

    if (error) {
      console.error("Error deleting property:", error);
    } else {
      set((state) => ({
        properties: state.properties.filter((property) => property.id !== id),
      }));
    }
  },
});
