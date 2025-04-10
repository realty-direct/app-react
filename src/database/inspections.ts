// File: src/database/inspections.ts
import type { TablesInsert, TablesUpdate } from "./database_types";
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
    console.log(`Fetching inspections for property ${propertyId}`);

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

    console.log(
      `Retrieved ${data?.length || 0} inspections for property ${propertyId}`
    );
    return data || [];
  } catch (error) {
    console.error("❌ Unexpected error in fetchPropertyInspections:", error);
    return [];
  }
};

/**
 * Creates a new inspection for a property
 */
export const createPropertyInspection = async (
  inspection: PropertyInspection
) => {
  try {
    console.log("Creating property inspection:", inspection);

    // Validate required fields
    if (
      !inspection.property_id ||
      !inspection.inspection_date ||
      !inspection.start_time ||
      !inspection.end_time ||
      !inspection.inspection_type
    ) {
      console.error("❌ Invalid inspection data - missing required fields");
      return null;
    }

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

    console.log("✅ Inspection created successfully:", data);
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
    console.log(`Updating inspection ${inspectionId} with:`, updates);

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

    console.log("✅ Inspection updated successfully:", data);
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
    console.log(`Deleting inspection ${inspectionId}`);

    const { error } = await supabase
      .from("property_inspections")
      .delete()
      .eq("id", inspectionId);

    if (error) {
      console.error("❌ Error deleting property inspection:", error);
      logErrorToDB(error);
      return false;
    }

    console.log("✅ Inspection deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deletePropertyInspection:", error);
    return false;
  }
};

/**
 * Batch creates multiple inspections for a property
 */
export const createMultipleInspections = async (
  inspections: PropertyInspection[]
) => {
  if (inspections.length === 0) {
    console.log("No inspections provided to create");
    return [];
  }

  try {
    console.log(`Creating ${inspections.length} inspections`, inspections);

    // Ensure all required fields are present
    const validInspections = inspections.filter((insp) => {
      if (
        !insp.property_id ||
        !insp.inspection_date ||
        !insp.start_time ||
        !insp.end_time ||
        !insp.inspection_type
      ) {
        console.warn("Skipping invalid inspection data:", insp);
        return false;
      }
      return true;
    });

    if (validInspections.length === 0) {
      console.error("No valid inspections to create after validation");
      return [];
    }

    const { data, error } = await supabase
      .from("property_inspections")
      .insert(validInspections)
      .select();

    if (error) {
      console.error("❌ Error creating multiple inspections:", error);
      logErrorToDB(error);
      return [];
    }

    console.log(`Successfully created ${data?.length || 0} inspections`);
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
    console.log(`Deleting all inspections for property ${propertyId}`);

    const { error } = await supabase
      .from("property_inspections")
      .delete()
      .eq("property_id", propertyId);

    if (error) {
      console.error("❌ Error deleting all property inspections:", error);
      logErrorToDB(error);
      return false;
    }

    console.log("✅ All inspections for property deleted successfully");
    return true;
  } catch (error) {
    console.error(
      "❌ Unexpected error in deleteAllPropertyInspections:",
      error
    );
    return false;
  }
};
