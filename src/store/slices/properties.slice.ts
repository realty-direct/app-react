import type { StateCreator } from "zustand";
import { supabase } from "../../lib/supabase";
import type { PropertiesState, Property } from "../types"; // ✅ Import correct types

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
  fetchProperties: async (userId: string) => {
    const { data, error } = await supabase
      .from("properties")
      .select(
        "id, user_id, address, property_type, sale_type, price, price_display, status, created_at"
      )
      .eq("user_id", userId) // Fetch only properties belonging to the logged-in user
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching properties:", error);
    } else {
      set(() => ({ properties: data as Property[] }));
    }
  },

  // ✅ Add a new property and return its ID
  addProperty: async (newProperty: Omit<Property, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("properties")
      .insert([newProperty])
      .select("id, created_at") // ✅ Explicitly request created_at
      .single();

    if (error) {
      console.error("Error adding property:", error);
      return null;
    }
    const newPropertyWithId: Property = {
      id: data.id,
      created_at: data.created_at, // ✅ Ensure `created_at` exists
      ...newProperty,
    };

    set((state) => ({
      properties: [...state.properties, newPropertyWithId],
    }));
    return data.id; // ✅ Return property ID to navigate after creation
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
