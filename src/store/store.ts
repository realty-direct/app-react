import { create } from "zustand";
import { supabase } from "../database/supabase";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createProfileSlice } from "./slices/user.slice";
import type { ProfileState, PropertiesState, SessionState } from "./types";

export type StoreState = ProfileState & PropertiesState & SessionState;

export const useRealtyStore = create<StoreState>((set, get, api) => ({
  ...createProfileSlice(set, get, api),
  ...createPropertiesSlice(set, get, api),
  ...createSessionSlice(set, get, api),
}));

// ✅ Automatically restore session when app loads
supabase.auth.getSession().then(({ data }) => {
  useRealtyStore.getState().setSession(data.session);
});

// ✅ Listen for authentication state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useRealtyStore.getState().setSession(session);
});

// ✅ Expose Zustand store to the window object for debugging
if (import.meta.env.MODE === "development" && typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (window as any).store = {
    getState: useRealtyStore.getState,
    setState: useRealtyStore.setState,
  };
}

export default useRealtyStore;
