import type { StateCreator } from "zustand";
import type { PropertiesState } from "../types";

export const createPropertiesSlice: StateCreator<PropertiesState> = (set) => ({
  properties: [],
  setProperties: (properties) => set(() => ({ properties })),
});
