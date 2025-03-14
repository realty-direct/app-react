import type { PropertyDetail } from "../store/types";
import type { TablesUpdate } from "./database_types";
import { logErrorToDB } from "./logs";
import { supabase } from "./supabase";

type PropertyDetailUpdate = TablesUpdate<"property_details">; // ✅ Ensure type safety

export const updatePropertyDetailInDB = async (
  propertyId: string,
  updates: Partial<PropertyDetailUpdate> // ✅ Only allows valid update fields
): Promise<PropertyDetail | null> => {
  const { data, error } = await supabase
    .from("property_details")
    .update(updates)
    .eq("property_id", propertyId)
    .select("*")
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
    logErrorToDB(error);
    return null;
  }

  return data; // ✅ Ensures correct typing
};

export const fetchUserPropertyDetailsFromDB = async (
  userId: string
): Promise<PropertyDetail[]> => {
  const { data, error } = await supabase
    .from("property_details")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("❌ Error fetching property details:", error);
    return [];
  }

  return data || [];
};

export const updatePropertyImagesInDB = async (
  propertyId: string,
  images: { url: string }[]
): Promise<PropertyDetail | null> => {
  return await updatePropertyDetailInDB(propertyId, {
    images,
    main_image: images.length > 0 ? images[0].url : null, // ✅ Clears main_image if no images
  });
};

export const updatePropertyFloorPlansInDB = async (
  propertyId: string,
  floorPlans: { url: string }[]
): Promise<PropertyDetail | null> => {
  return await updatePropertyDetailInDB(propertyId, {
    floor_plans: floorPlans,
  });
};

export const fetchPropertyImagesFromDB = async (propertyIds: string[]) => {
  if (propertyIds.length === 0) return [];

  const { data, error } = await supabase
    .from("property_details")
    .select("property_id, images")
    .in("property_id", propertyIds);

  if (error) {
    console.error("❌ Error fetching images:", error);
    return [];
  }

  return data.map((item) => ({
    property_id: item.property_id,
    images: item.images ?? null, // ✅ Ensure correct `Json | null` type
  }));
};
