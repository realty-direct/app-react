import type { TablesInsert } from "./database_types";
import { supabase } from "./supabase";

// ✅ Fetch property features from Supabase
export const fetchPropertyFeaturesFromDB = async (propertyIds: string[]) => {
  const { data, error } = await supabase
    .from("property_features")
    .select("*")
    .in("property_id", propertyIds);

  if (error) {
    console.error("❌ Error fetching features:", error);
    return [];
  }

  return data;
};

// ✅ Save features to Supabase in one batch
export const savePropertyFeaturesToDB = async (
  propertyId: string,
  features: Omit<TablesInsert<"property_features">, "id">[]
) => {
  try {
    const { data: existingFeatures, error: fetchError } = await supabase
      .from("property_features")
      .select("id, feature_name")
      .eq("property_id", propertyId);

    if (fetchError) {
      console.error("❌ Error fetching existing features:", fetchError);
      return false;
    }

    const existingFeatureNames = new Set(
      existingFeatures.map((f) => f.feature_name)
    );

    const newFeatures = features
      .filter((f) => !existingFeatureNames.has(f.feature_name))
      .map((f) => ({
        property_id: propertyId,
        feature_name: f.feature_name,
        feature_type: f.feature_type,
      }));

    const featuresToRemove = existingFeatures
      .filter(
        (f) =>
          !features.some((feature) => feature.feature_name === f.feature_name)
      )
      .map((f) => f.id);

    if (featuresToRemove.length > 0) {
      await supabase
        .from("property_features")
        .delete()
        .in("id", featuresToRemove);
    }

    if (newFeatures.length > 0) {
      await supabase.from("property_features").insert(newFeatures);
    }

    console.log("✅ Property features saved successfully!");
    return true;
  } catch (error) {
    console.error("❌ savePropertyFeaturesToDB error:", error);
    return false;
  }
};
