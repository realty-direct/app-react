/* eslint-disable @typescript-eslint/no-explicit-any */
// ! WARNING: Be careful of any type in this file, had to add this here because of biome and eslint.
import { create } from "zustand";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createUserSlice } from "./slices/user.slice";
import type { PropertiesState, SessionState, UserState } from "./types";

export type StoreState = UserState & PropertiesState & SessionState;

export const useRealtyStore = create<StoreState>((set, get, api) => ({
  ...createUserSlice(set, get, api),
  ...createPropertiesSlice(set, get, api),
  ...createSessionSlice(set, get, api),
}));

// ✅ Expose Zustand store to the window object for debugging
if (typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (window as any).store = {
    getState: useRealtyStore.getState, // ✅ View store state in console
    setState: useRealtyStore.setState, // ✅ Modify store state in console
    resetState: () => useRealtyStore.setState(useRealtyStore.getState()), // ✅ Reset store state
  };
}

export default useRealtyStore;
