import { TablesInsert, TablesUpdate } from "./database_types";
import { logErrorToDB } from "./logs";
import { supabase } from "./supabase";

// Type aliases for better readability
export type PropertyInspection = TablesInsert<"property_inspections">;
type PropertyInspectionUpdate = TablesUpdate<"property_inspections">;

/**
 * Fetches all inspections for a specific property
 */
export const fetchPropertyInspections = async (propertyId: string) => {
  try {
    const { data, error } = await supabase
      .from("property_inspections")
      .select("*")
      .eq("property_id", propertyId)
      .order("inspection_date", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("❌ Error fetching property inspections:", error);
      logErrorToDB(error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("❌ Unexpected error in fetchPropertyInspections:", error);
    return [];
  }
};

/**
 * Creates a new inspection for a property
 */
export const createPropertyInspection = async (inspection: PropertyInspection) => {
  try {
    const { data, error } = await supabase
      .from("property_inspections")
      .insert([inspection])
      .select()
      .single();

    if (error) {
      console.error("❌ Error creating property inspection:", error);
      logErrorToDB(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Unexpected error in createPropertyInspection:", error);
    return null;
  }
};

/**
 * Updates an existing inspection
 */
export const updatePropertyInspection = async (
  inspectionId: string,
  updates: PropertyInspectionUpdate
) => {
  try {
    const { data, error } = await supabase
      .from("property_inspections")
      .update(updates)
      .eq("id", inspectionId)
      .select()
      .single();

    if (error) {
      console.error("❌ Error updating property inspection:", error);
      logErrorToDB(error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("❌ Unexpected error in updatePropertyInspection:", error);
    return null;
  }
};

/**
 * Deletes an inspection by ID
 */
export const deletePropertyInspection = async (inspectionId: string) => {
  try {
    const { error } = await supabase
      .from("property_inspections")
      .delete()
      .eq("id", inspectionId);

    if (error) {
      console.error("❌ Error deleting property inspection:", error);
      logErrorToDB(error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deletePropertyInspection:", error);
    return false;
  }
};

/**
 * Batch creates multiple inspections for a property
 */
export const createMultipleInspections = async (inspections: PropertyInspection[]) => {
  if (inspections.length === 0) return [];

  try {
    const { data, error } = await supabase
      .from("property_inspections")
      .insert(inspections)
      .select();

    if (error) {
      console.error("❌ Error creating multiple inspections:", error);
      logErrorToDB(error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("❌ Unexpected error in createMultipleInspections:", error);
    return [];
  }
};

/**
 * Deletes all inspections for a property
 */
export const deleteAllPropertyInspections = async (propertyId: string) => {
  try {
    const { error } = await supabase
      .from("property_inspections")
      .delete()
      .eq("property_id", propertyId);

    if (error) {
      console.error("❌ Error deleting all property inspections:", error);
      logErrorToDB(error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deleteAllPropertyInspections:", error);
    return false;
  }
};