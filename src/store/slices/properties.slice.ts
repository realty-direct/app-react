import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
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

  // ✅ Fetch properties from Supabase (fully self-contained)
  fetchUserProperties: async (userId: string) => {
    try {
      const { data: properties, error } = await supabase
        .from("properties")
        .select(
          "id, user_id, address, property_type, sale_type, price, price_display, status, created_at"
        ) // ✅ Ensure only necessary fields are selected
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching properties:", error);
        throw new Error("Failed to load properties");
      }

      if (!properties || properties.length === 0) {
        console.warn("No properties found");
      }

      set(() => ({ properties })); // ✅ Zustand update
    } catch (error) {
      console.error("fetchProperties error:", error);
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
      created_at: data.created_at,
      ...newProperty,
    };

    set((state) => ({
      properties: [...state.properties, newPropertyWithId],
    }));

    return data.id;
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
