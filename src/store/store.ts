import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../database/supabase";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createProfileSlice } from "./slices/user.slice";
import type { ProfileState, PropertiesState, SessionState } from "./types";

export type StoreState = ProfileState & PropertiesState & SessionState;

export const useRealtyStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProfileSlice(set, get, api),
      ...createPropertiesSlice(set, get, api),
      ...createSessionSlice(set, get, api),
    }),
    {
      name: "realty-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        properties: state.properties,
      }),
    }
  )
);

// ✅ Restore session when app loads & fetch profile + properties
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    useRealtyStore.getState().setSession(data.session);

    // ✅ Fetch user profile & properties here (NOT in session slice)
    useRealtyStore.getState().fetchUserProfile(data.session.user.id);
    useRealtyStore.getState().fetchUserProperties(data.session.user.id);
  }
});

// ✅ Listen for authentication state changes
supabase.auth.onAuthStateChange((_event, session) => {
  useRealtyStore.getState().setSession(session);

  if (session?.user) {
    // ✅ Fetch user profile & properties here (NOT in session slice)
    useRealtyStore.getState().fetchUserProfile(session.user.id);
    useRealtyStore.getState().fetchUserProperties(session.user.id);
  }
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
