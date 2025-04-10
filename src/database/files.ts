// src/database/files.ts - Simplified file deletion following Supabase documentation
import { supabase } from "./supabase";

/**
 * Deletes a file from Supabase storage based on its public URL
 * Uses the recommended Supabase approach with proper error handling
 */
export const deleteFileFromStorage = async (
  fileUrl: string
): Promise<boolean> => {
  try {
    // Extract the file path from the URL
    let bucketName = "property_photographs";
    let filePath;

    console.log("🔍 Attempting to delete file:", fileUrl);

    if (fileUrl.includes("property_photographs")) {
      filePath = fileUrl.split(
        "/storage/v1/object/public/property_photographs/"
      )[1];
    } else if (fileUrl.includes("property-floorplans")) {
      bucketName = "property-floorplans";
      filePath = fileUrl.split(
        "/storage/v1/object/public/property-floorplans/"
      )[1];
    }

    if (!filePath) {
      console.error("❌ Could not extract file path from URL:", fileUrl);
      return false;
    }

    console.log(`🔧 Extracted path: ${filePath} from bucket: ${bucketName}`);

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error(
        "❌ No authenticated session found. Storage operations require authentication."
      );
      return false;
    }

    // Use the Supabase remove method as recommended in the docs
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error(`❌ Supabase storage deletion error:`, error);

      // RLS-specific error message
      if (
        error.message.includes("permission") ||
        error.message.includes("not authorized")
      ) {
        console.error(`
        ❌ This appears to be an RLS (Row Level Security) permission issue.
        
        Check that you have a policy in your Supabase dashboard that allows authenticated 
        users to delete objects, such as:
        
        create policy "User can delete their own objects"
        on storage.objects
        for delete
        TO authenticated
        USING ( owner = (select auth.uid()::text));
        `);
      }

      return false;
    }

    // Check response and log results
    if (data && Array.isArray(data)) {
      if (data.length === 0) {
        console.log(
          "⚠️ Supabase returned empty data array. File might not exist."
        );
        return true; // Consider it a success if there's no error
      }

      const failedItems = data.filter((item) => item.error);

      if (failedItems.length > 0) {
        console.error("❌ Some files failed to delete:", failedItems);
        return false;
      }

      console.log(`✅ Successfully deleted ${data.length} files:`, data);
      return true;
    }

    // If we got here with no errors, consider it a success
    console.log(`✅ File deletion successful for ${filePath}`);
    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deleteFileFromStorage:", error);
    return false;
  }
};

/**
 * Cleans up all files in a storage bucket for a specific property ID
 */
export const cleanupStorageBucket = async (
  propertyId: string,
  bucketName: string
): Promise<boolean> => {
  try {
    console.log(`🔍 Listing files in ${bucketName}/${propertyId}`);

    // Verify authentication
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error(
        "❌ No authenticated session found. Storage operations require authentication."
      );
      return false;
    }

    // List all files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucketName)
      .list(propertyId);

    if (listError) {
      console.error(
        `❌ Error listing files in ${bucketName}/${propertyId}:`,
        listError
      );
      return false;
    }

    if (files && files.length > 0) {
      console.log(
        `📁 Found ${files.length} files to delete in ${bucketName}/${propertyId}`
      );

      // Create an array of paths to delete
      const filePaths = files.map((file) => `${propertyId}/${file.name}`);

      // Delete all files in the property folder
      const { data: deleteData, error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove(filePaths);

      if (deleteError) {
        console.error(
          `❌ Error deleting files from ${bucketName}/${propertyId}:`,
          deleteError
        );
        return false;
      } else {
        console.log(
          `✅ Deleted files from ${bucketName}/${propertyId}:`,
          deleteData
        );
        return true;
      }
    } else {
      console.log(`ℹ️ No files found in ${bucketName}/${propertyId}`);
      return true;
    }
  } catch (error) {
    console.error(
      `❌ Error cleaning up ${bucketName} for property ${propertyId}:`,
      error
    );
    return false;
  }
};

/**
 * Cleans up all files associated with a property ID across all storage buckets
 */
export const cleanupAllPropertyFiles = async (
  propertyId: string
): Promise<boolean> => {
  const results = await Promise.all([
    cleanupStorageBucket(propertyId, "property_photographs"),
    cleanupStorageBucket(propertyId, "property-floorplans"),
  ]);

  // Return true only if all operations were successful
  return results.every((result) => result === true);
};
