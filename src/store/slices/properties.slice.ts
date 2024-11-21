import type { StateCreator } from "zustand";
import type { PropertiesState } from "../types";

export const createPropertiesSlice: StateCreator<PropertiesState> = (set) => ({
  properties: [],
  selectedProperty: null,
  setProperties: (properties) => set(() => ({ properties })),
  setSelectedProperty: (id) => set(() => ({ selectedProperty: id })),
  clearSelectedProperty: () => set(() => ({ selectedProperty: null })),
});
