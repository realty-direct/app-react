import type { StateCreator } from "zustand";
import { savePropertyFeaturesToDB } from "../../database/features"; // ✅ Import Supabase functions
import type { PropertyFeature, PropertyFeaturesState } from "../types";

export type FeatureType =
  | "inside"
  | "heating_cooling"
  | "eco_friendly"
  | "outdoor";

export const createPropertyFeaturesSlice: StateCreator<
  PropertyFeaturesState
> = (set, get) => ({
  propertyFeatures: [],

  setPropertyFeatures: (features: PropertyFeature[]) =>
    set({ propertyFeatures: features }),

  clearPropertyFeatures: () => set({ propertyFeatures: [] }),

  toggleFeatureSelection: (
    propertyId: string,
    feature: Omit<PropertyFeature, "id">
  ) => {
    set((state) => {
      const exists = state.propertyFeatures.some(
        (f) =>
          f.property_id === propertyId &&
          f.feature_name === feature.feature_name
      );

      return {
        propertyFeatures: exists
          ? state.propertyFeatures.filter(
              (f) =>
                !(
                  f.property_id === propertyId &&
                  f.feature_name === feature.feature_name
                )
            )
          : [
              ...state.propertyFeatures,
              { ...feature, id: crypto.randomUUID() },
            ], // ✅ Temporary `id` for Zustand
      };
    });
  },

  // ✅ Save all features to Supabase when "Continue" is clicked
  savePropertyFeatures: async (propertyId: string) => {
    const { propertyFeatures } = get();
    const featuresForProperty = propertyFeatures.filter(
      (f) => f.property_id === propertyId
    );

    const success = await savePropertyFeaturesToDB(
      propertyId,
      featuresForProperty
    );
    if (success) console.log("✅ Features synced with Supabase!");
  },
});
