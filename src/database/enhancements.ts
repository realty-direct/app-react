import type { PropertyEnhancement } from "../store/slices/enhancements.slice";
import { supabase } from "./supabase";

export const fetchPropertyEnhancements = async (
  propertyId: string
): Promise<PropertyEnhancement[]> => {
  try {
    console.log("Debug: Fetching enhancements for property ID:", propertyId);
    const { data, error } = await supabase
      .from("property_enhancements")
      .select("*")
      .eq("property_id", propertyId);

    console.log("Debug: Fetch enhancements response:", { data, error });

    if (error) {
      console.error("❌ Error fetching property enhancements:", error);
      return [];
    }

    return data as PropertyEnhancement[];
  } catch (err) {
    console.error("❌ Unexpected error in fetchPropertyEnhancements:", err);
    return [];
  }
};

export const addPropertyEnhancement = async (
  enhancement: Omit<PropertyEnhancement, "id" | "created_at" | "updated_at">
): Promise<PropertyEnhancement | null> => {
  try {
    console.log("Debug: addPropertyEnhancement called with:", enhancement);

    const { data, error } = await supabase
      .from("property_enhancements")
      .insert([enhancement])
      .select();

    console.log("Debug: Supabase response:", { data, error });

    if (error) {
      console.error("❌ Error adding property enhancement:", error);
      return null;
    }

    return data && data.length > 0 ? (data[0] as PropertyEnhancement) : null;
  } catch (err) {
    console.error("❌ Unexpected error in addPropertyEnhancement:", err);
    return null;
  }
};

export const removePropertyEnhancement = async (
  enhancementId: string
): Promise<boolean> => {
  try {
    console.log("Debug: Removing enhancement with ID:", enhancementId);

    const { error } = await supabase
      .from("property_enhancements")
      .delete()
      .eq("id", enhancementId);

    if (error) {
      console.error("❌ Error removing property enhancement:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Unexpected error in removePropertyEnhancement:", err);
    return false;
  }
};

export const updatePropertyPackage = async (
  propertyId: string,
  packageType: "ESSENTIAL" | "ADVANTAGE" | "PREMIUM" | null
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("property_details")
      .update({ property_package: packageType })
      .eq("property_id", propertyId);

    if (error) {
      console.error("❌ Error updating property package:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Unexpected error in updatePropertyPackage:", err);
    return false;
  }
};
