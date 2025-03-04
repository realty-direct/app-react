import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { supabase } from "../database/supabase";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createPropertyDetailsSlice } from "./slices/property_details.slice";
import { createPropertyFeaturesSlice } from "./slices/property_features.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createProfileSlice } from "./slices/user.slice";
import type {
  ProfileState,
  PropertiesState,
  PropertyDetailsState,
  PropertyFeaturesState,
  SessionState,
} from "./types";

export type StoreState = ProfileState &
  PropertiesState &
  PropertyDetailsState &
  SessionState &
  PropertyFeaturesState;

export const useRealtyStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProfileSlice(set, get, api),
      ...createPropertiesSlice(set, get, api),
      ...createPropertyDetailsSlice(set, get, api),
      ...createSessionSlice(set, get, api),
      ...createPropertyFeaturesSlice(set, get, api),
    }),
    {
      name: "realty-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        properties: state.properties,
        propertyDetails: state.propertyDetails,
        propertyFeatures: state.propertyFeatures, // ✅ Persist property features
      }),
    }
  )
);

// ✅ Function to restore session & fetch profile, properties, and details
const restoreSessionAndData = async (session: Session | null) => {
  const store = useRealtyStore.getState(); // 🔥 Optimized: Avoids repeated `.getState()` calls

  if (!session?.user) {
    store.clearSession(); // ✅ Ensure state is reset on logout
    return;
  }

  try {
    store.setSession(session);

    // ✅ Fetch user profile
    await store.fetchUserProfile(session.user.id);

    // ✅ Fetch user properties
    await store.fetchUserProperties(session.user.id);

    // ✅ Fetch property details **only if properties exist**
    const propertyIds = store.properties.map((p) => p.id);

    await store.fetchUserPropertyDetails(propertyIds);

    if (propertyIds.length > 0) {
      await store.fetchAllPropertyFeatures(propertyIds);
    }
  } catch (error) {
    console.error("❌ Error restoring session and fetching data:", error);
  }
};

// ✅ Restore session when app loads
supabase.auth.getSession().then(({ data }) => {
  restoreSessionAndData(data.session);
});

// ✅ Listen for authentication state changes
supabase.auth.onAuthStateChange((_event, session) => {
  restoreSessionAndData(session);
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
