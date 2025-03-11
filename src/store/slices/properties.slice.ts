import type { StateCreator } from "zustand";
import type { PropertiesState, Property } from "../types";

export const createPropertiesSlice: StateCreator<PropertiesState> = (
  set,
  get
) => ({
  properties: [],

  setProperties: (properties: Property[]) => set({ properties }),

  clearProperties: () => set({ properties: [] }),

  addProperty: (newProperty: Property): void => {
    set((state) => ({
      properties: [...state.properties, newProperty],
    }));
  },
});
