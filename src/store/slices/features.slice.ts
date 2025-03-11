import type { StateCreator } from "zustand";
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

  // ✅ Updates only the relevant property’s features
  setPropertyFeatures: (features: PropertyFeature[]) => {
    set(() => ({
      propertyFeatures: features, // ✅ Store all features at once
    }));
  },

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
          : [...state.propertyFeatures, feature],
      };
    });
  },
});
