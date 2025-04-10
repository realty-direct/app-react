import { createClient } from "@supabase/supabase-js";
import { deleteFileFromStorage } from "./files";

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
    console.log("⚙️ Starting image deletion process for:", imageUrl);

    // Use the improved deleteFileFromStorage function
    const success = await deleteFileFromStorage(imageUrl);

    if (!success) {
      console.error("❌ Failed to delete image from storage:", imageUrl);
      console.error(`
      ⚠️ IMPORTANT: This is likely an RLS (Row Level Security) permission issue.
      Check your Supabase storage bucket policies to ensure they allow:
      
      1. The current authenticated user to delete files
      2. The appropriate policy exists for the bucket (property_photographs or property-floorplans)
      `);
      return false;
    }

    console.log("✅ Successfully deleted image from storage:", imageUrl);
    return true;
  } catch (error) {
    console.error("❌ deletePropertyImageFromDB error:", error);
    return false;
  }
};
