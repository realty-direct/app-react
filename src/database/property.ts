import type { Property } from "../store/types";
import type { TablesInsert } from "./database_types";
import { cleanupAllPropertyFiles } from "./files";
import { supabase } from "./supabase";

export const createPropertyInDB = async (
  property: Omit<TablesInsert<"properties">, "id" | "created_at">
): Promise<Property | null> => {
  const { data, error } = await supabase
    .from("properties")
    .insert([property])
    .select("*")
    .single();

  if (error || !data) {
    console.error("❌ Error adding property:", error);
    return null;
  }

  return data; // Returns the inserted property
};

export const fetchPropertyFromDB = async (
  propertyId: string
): Promise<Property | null> => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", propertyId)
    .single();

  if (error) {
    console.error("❌ Error fetching property:", error);
    return null;
  }

  return data; // ✅ Ensures correct typing
};

export const fetchAllPropertiesFromDB = async (userId: string) => {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Error fetching properties:", error);
    return [];
  }

  return data;
};

export const deleteProperty = async (propertyId: string) => {
  try {
    // First delete property details and features to maintain referential integrity
    const { error: detailsError } = await supabase
      .from("property_details")
      .delete()
      .eq("property_id", propertyId);

    if (detailsError) {
      console.error("❌ Error deleting property details:", detailsError);
      // Continue with deletion even if this fails
    }

    const { error: featuresError } = await supabase
      .from("property_features")
      .delete()
      .eq("property_id", propertyId);

    if (featuresError) {
      console.error("❌ Error deleting property features:", featuresError);
      // Continue with deletion even if this fails
    }

    // Clean up storage files in all buckets
    await cleanupAllPropertyFiles(propertyId);

    // Finally, delete the property record itself
    const { error } = await supabase
      .from("properties")
      .delete()
      .eq("id", propertyId);

    if (error) {
      console.error("❌ Error deleting property:", error);
      throw new Error("Error deleting property");
    }

    console.log(
      `✅ Property ${propertyId} and its resources deleted successfully`
    );
    return true;
  } catch (error) {
    console.error("❌ Error in deleteProperty:", error);
    throw error;
  }
};
