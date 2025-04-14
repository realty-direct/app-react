import type { PropertyEnhancement } from "../store/slices/enhancements.slice";
import { supabase } from "./supabase";

export const fetchPropertyEnhancements = async (
  propertyId: string
): Promise<PropertyEnhancement[]> => {
  const { data, error } = await supabase
    .from("property_enhancements")
    .select("*")
    .eq("property_id", propertyId);

  if (error) {
    console.error("❌ Error fetching property enhancements:", error);
    return [];
  }

  return data as PropertyEnhancement[];
};

export const addPropertyEnhancement = async (
  enhancement: Omit<PropertyEnhancement, "id" | "created_at" | "updated_at">
): Promise<PropertyEnhancement | null> => {
  const { data, error } = await supabase
    .from("property_enhancements")
    .insert([enhancement])
    .select();

  if (error) {
    console.error("❌ Error adding property enhancement:", error);
    return null;
  }

  return data && data.length > 0 ? (data[0] as PropertyEnhancement) : null;
};

export const removePropertyEnhancement = async (
  enhancementId: string
): Promise<boolean> => {
  const { error } = await supabase
    .from("property_enhancements")
    .delete()
    .eq("id", enhancementId);

  if (error) {
    console.error("❌ Error removing property enhancement:", error);
    return false;
  }

  return true;
};

export const updatePropertyPackage = async (
  propertyId: string,
  packageType: "ESSENTIAL" | "ADVANTAGE" | "PREMIUM" | null
): Promise<boolean> => {
  const { error } = await supabase
    .from("property_details")
    .update({ property_package: packageType })
    .eq("property_id", propertyId);

  if (error) {
    console.error("❌ Error updating property package:", error);
    return false;
  }

  return true;
};
