import type { PropertyDetail } from "../store/types";
import type { TablesUpdate } from "./database_types";
import { supabase } from "./supabase";

type PropertyDetailUpdate = TablesUpdate<"property_details">; // ✅ Ensure type safety

export const updatePropertyDetailInDB = async (
  propertyId: string,
  updates: Partial<PropertyDetailUpdate> // ✅ Only allows valid update fields
): Promise<void> => {
  const { data, error } = await supabase
    .from("property_details")
    .update(updates)
    .eq("property_id", propertyId)
    .select()
    .single();

  if (error || !data) {
    console.error("❌ Error updating property details:", error);
    throw new Error("Error updating property details");
  }

  return data; // ✅ Returns the updated row for Zustand
};

export const fetchPropertyDetailInDb = async (
  propertyId: string
): Promise<PropertyDetail | null> => {
  const { data, error } = await supabase
    .from("property_details")
    .select("*")
    .eq("property_id", propertyId)
    .single();

  if (error) {
    console.error("❌ Error fetching property details:", error);
    return null;
  }

  return data; // ✅ Ensures correct typing
};
