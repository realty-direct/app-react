import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
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

  clearPropertyFeatures: () => set({ propertyFeatures: [] }), // ✅ Re-added function

  toggleFeatureSelection: (propertyId, feature) => {
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
          : [...state.propertyFeatures, feature], // ✅ No `id`, let Supabase handle it
      };
    });
  },

  fetchAllPropertyFeatures: async (propertyIds: string[]) => {
    if (propertyIds.length === 0) return; // ✅ Avoid unnecessary query

    try {
      const { data, error } = await supabase
        .from("property_features")
        .select("*")
        .in("property_id", propertyIds); // ✅ Fetch all in one query

      if (error) {
        console.error("❌ Error fetching property features:", error);
        return;
      }

      set({ propertyFeatures: data || [] });
    } catch (error) {
      console.error("❌ fetchAllPropertyFeatures error:", error);
    }
  },

  savePropertyFeatures: async (propertyId: string) => {
    try {
      const { propertyFeatures } = get();
      const featuresForProperty = propertyFeatures.filter(
        (f) => f.property_id === propertyId
      );

      // ✅ Step 1: Fetch existing features in Supabase
      const { data: existingFeatures, error: fetchError } = await supabase
        .from("property_features")
        .select("id, feature_name")
        .eq("property_id", propertyId);

      if (fetchError) {
        console.error(
          "❌ Error fetching existing property features:",
          fetchError
        );
        return;
      }

      const existingFeatureNames = new Set(
        existingFeatures?.map((f) => f.feature_name)
      );

      // ✅ Step 2: Find new features to insert
      const newFeatures = featuresForProperty
        .filter((f) => !existingFeatureNames.has(f.feature_name))
        .map((f) => ({
          property_id: propertyId, // ✅ Ensure property_id is included
          feature_type: f.feature_type,
          feature_name: f.feature_name,
        }));

      // ✅ Step 3: Find features to remove
      const featuresToRemove = existingFeatures
        ?.filter(
          (f) =>
            !featuresForProperty.some(
              (feature) => feature.feature_name === f.feature_name
            )
        )
        .map((f) => f.id);

      // ✅ Step 4: Remove unchecked features from Supabase
      if (featuresToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from("property_features")
          .delete()
          .in("id", featuresToRemove);

        if (deleteError) {
          console.error("❌ Error deleting property features:", deleteError);
        }
      }

      // ✅ Step 5: Insert new features
      if (newFeatures.length > 0) {
        const { error: insertError } = await supabase
          .from("property_features")
          .insert(newFeatures);

        if (insertError) {
          console.error("❌ Error inserting property features:", insertError);
        }
      }

      // ✅ Step 6: Update Zustand Store
      set((state) => ({
        propertyFeatures: [
          ...state.propertyFeatures.filter((f) => f.property_id !== propertyId),
          ...featuresForProperty, // ✅ Add latest features
        ],
      }));

      console.log("✅ Property features saved successfully!");
    } catch (error) {
      console.error("❌ savePropertyFeatures error:", error);
    }
  },
});
