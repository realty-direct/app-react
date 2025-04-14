import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchUserProfile } from "../database/auth";
import {
  fetchPropertyImagesFromDB,
  fetchUserPropertyDetailsFromDB,
} from "../database/details";

import { fetchUserPropertiesFeaturesFromDB } from "../database/features";
import { fetchPropertyInspections } from "../database/inspections";
import { fetchAllPropertiesFromDB } from "../database/property";
import { supabase } from "../database/supabase";
import { createPropertyDetailsSlice } from "./slices/details.slice";
import {
  PropertyEnhancementsState,
  createPropertyEnhancementsSlice,
} from "./slices/enhancements.slice";
import { createPropertyFeaturesSlice } from "./slices/features.slice";
import { createPropertyInspectionsSlice } from "./slices/inspections.slice";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createProfileSlice } from "./slices/user.slice";
import type {
  ProfileState,
  PropertiesState,
  PropertyDetailsState,
  PropertyFeaturesState,
  PropertyInspectionsState,
  SessionState,
} from "./types";

export type StoreState = ProfileState &
  PropertiesState &
  PropertyDetailsState &
  SessionState &
  PropertyFeaturesState &
  PropertyInspectionsState &
  PropertyEnhancementsState;

export const useRealtyStore = create<StoreState>()(
  persist(
    (set, get, api) => ({
      ...createProfileSlice(set, get, api),
      ...createPropertiesSlice(set, get, api),
      ...createPropertyDetailsSlice(set, get, api),
      ...createSessionSlice(set, get, api),
      ...createPropertyFeaturesSlice(set, get, api),
      ...createPropertyInspectionsSlice(set, get, api),
      ...createPropertyEnhancementsSlice(set, get, api),
    }),
    {
      name: "realty-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
        profile: state.profile,
        properties: state.properties,
        propertyDetails: state.propertyDetails,
        propertyFeatures: state.propertyFeatures,
        propertyInspections: state.propertyInspections,
        propertyEnhancements: state.propertyEnhancements,
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

    //# Get profile info and add to store
    const { profile, profileError } = await fetchUserProfile(session.user.id);

    if (profileError) {
      //TODO: Bigger error should be thrown
      console.error("❌ Error fetching user profile:", profileError);
      return;
    }

    store.setProfile(profile);

    //# Get properties and add to store
    const properties = await fetchAllPropertiesFromDB(session.user.id);
    store.setProperties(properties);

    const propertyIds = properties.map((p) => p.id);

    //# Get property details and add to store
    const propertyDetails = await fetchUserPropertyDetailsFromDB(
      session.user.id
    );

    store.setPropertyDetails(propertyDetails);

    if (propertyIds.length > 0) {
      // ✅ Fetch property features & add to store
      const propertyFeatures =
        await fetchUserPropertiesFeaturesFromDB(propertyIds);
      store.setPropertyFeatures(propertyFeatures);

      // ✅ Fetch property images & update store
      const propertyImages = await fetchPropertyImagesFromDB(propertyIds);
      store.setPropertyImages(propertyImages);

      // ✅ Fetch property inspections for the user's properties
      for (const propertyId of propertyIds) {
        const inspections = await fetchPropertyInspections(propertyId);
        if (inspections.length > 0) {
          store.setPropertyInspections(inspections);
        }
      }
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
