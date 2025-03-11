import type { TablesInsert } from "../database/database_types";
import { supabase } from "../database/supabase";

export const fetchUserPropertiesFeaturesFromDB = async (
  propertyIds: string[]
) => {
  if (propertyIds.length === 0) return [];

  const { data, error } = await supabase
    .from("property_features")
    .select("*")
    .in("property_id", propertyIds); // ✅ Fetch all at once

  if (error) {
    console.error("❌ Error fetching multiple property features:", error);
    return [];
  }

  return data;
};

// ✅ Fetch property features from Supabase
export const fetchUserPropertyFeaturesFromDB = async (propertyId: string) => {
  const { data, error } = await supabase
    .from("property_features")
    .select("*")
    .eq("property_id", propertyId);

  if (error) {
    console.error("❌ Error fetching property features:", error);
    return [];
  }

  return data;
};

// ✅ Update property features in Supabase
export const updatePropertyFeatureInDB = async (
  propertyId: string,
  features: Omit<TablesInsert<"property_features">, "id">[]
) => {
  try {
    // Fetch existing features
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

    // Insert new features
    const newFeatures = features
      .filter((f) => !existingFeatureNames.has(f.feature_name))
      .map((f) => ({
        property_id: propertyId,
        feature_name: f.feature_name,
        feature_type: f.feature_type,
      }));

    // Remove unchecked features
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

    console.log("✅ Property features updated successfully!");
    return true;
  } catch (error) {
    console.error("❌ updatePropertyFeatureInDB error:", error);
    return false;
  }
};
