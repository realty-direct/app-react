import { createClient } from "@supabase/supabase-js";
import { directFloorPlanDelete } from "./files";

// ✅ Move these to .env in production
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // ✅ Ensure session persistence
    autoRefreshToken: true, // ✅ Automatically refresh tokens when needed
    detectSessionInUrl: false, // ✅ Prevent URL-based session handling
  },
});

// ✅ Check User Session (Returns `user` object or `null`)
export const checkUserSession = async () => {
  const { data, error } = await supabase.auth.getUser();
  console.log("User session data:", data);
  if (error) {
    console.error("❌ Error fetching user session:", error.message);
    return null;
  }
  return data.user || null;
};

export const uploadPropertyImage = async (propertyId: string, file: File) => {
  // ✅ Create a unique filename
  const safeFileName = file.name
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9.-]/g, "") // Remove special characters
    .toLowerCase();

  const filePath = `${propertyId}/${crypto.randomUUID()}-${safeFileName}`; // 🔥 Ensure uniqueness

  // ✅ Use the exact bucket name
  const { data, error } = await supabase.storage
    .from("property_photographs") // 🔥 Ensure this matches exactly
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("❌ Image upload failed:", error);
    return null;
  }

  return supabase.storage.from("property_photographs").getPublicUrl(filePath)
    .data.publicUrl;
};

export const uploadFloorPlan = async (propertyId: string, file: File) => {
  const filePath = `${propertyId}/${Date.now()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`;

  const { data, error } = await supabase.storage
    .from("property-floorplans") // ✅ Correct bucket for floor plans
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error("❌ Floor plan upload failed:", error);
    return null;
  }

  return supabase.storage.from("property-floorplans").getPublicUrl(filePath)
    .data.publicUrl;
};

export const deletePropertyImageFromDB = async (
  imageUrl: string
): Promise<boolean> => {
  try {
    console.log("⚙️ Starting deletion process for:", imageUrl);

    // For floor plans, use our specialized direct method
    if (imageUrl.includes("property-floorplans")) {
      console.log("📐 Detected floor plan - using direct method");
      const success = await directFloorPlanDelete(imageUrl);

      if (!success) {
        console.error("❌ Failed to delete floor plan:", imageUrl);
        return false;
      }

      console.log("✅ Successfully deleted floor plan");
      return true;
    }

    // For regular photographs, use standard deletion method
    let bucketName = "property_photographs";
    let filePath;

    filePath = imageUrl.split(
      "/storage/v1/object/public/property_photographs/"
    )[1];

    if (!filePath) {
      console.error("❌ Could not extract file path from URL:", imageUrl);
      return false;
    }

    // Simple direct approach for photos - this seems to be working
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`❌ Failed to delete photograph:`, error);
      return false;
    }

    console.log("✅ Successfully deleted photograph from storage");
    return true;
  } catch (error) {
    console.error("❌ deletePropertyImageFromDB error:", error);
    return false;
  }
};
