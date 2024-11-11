// propertiesSlice.ts
import type { StateCreator } from "zustand";
import type { StoreState } from "../store";
import type { Property } from "../types";

export interface PropertiesState {
  properties: Property[];
  fetchProperties: () => Promise<void>;
}

export const createPropertiesSlice: StateCreator<
  StoreState,
  [],
  [],
  PropertiesState
> = (set) => ({
  properties: [],
  fetchProperties: async () => {
    try {
      const response = await fetch("/api/properties"); // Replace with your API endpoint
      const data = await response.json();
      set({ properties: data as Property[] });
    } catch (error) {
      console.error("Failed to fetch properties", error);
    }
  },
});
