import type { Property } from "../store/types";
import type { TablesInsert } from "./database_types";
import { supabase } from "./supabase";

export const createPropertyInDB = async (
  property: Omit<TablesInsert<"properties">, "id" | "created_at">
) => {
  const { data, error } = await supabase
    .from("properties")
    .insert([property])
    .select("id, created_at")
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
