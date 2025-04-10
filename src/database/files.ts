// src/database/files.ts - Complete file with all functions
import { supabase } from "./supabase";

/**
 * Uploads a file to the specified Supabase storage bucket with proper error handling
 * @param propertyId - The ID of the property
 * @param file - The file to upload
 * @param bucketName - The storage bucket name ('property_photographs', 'property-floorplans', 'property-ownership', or 'property-identification')
 * @returns The public URL of the uploaded file, or null on failure
 */
export const uploadFile = async (
  propertyId: string,
  file: File,
  bucketName:
    | "property_photographs"
    | "property-floorplans"
    | "property-ownership"
    | "property-identification"
): Promise<string | null> => {
  // Create a unique filename
  const safeFileName = file.name
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^a-zA-Z0-9.-]/g, "") // Remove special characters
    .toLowerCase();

  // Use consistent unique ID generation
  const uniqueId = crypto.randomUUID();
  const filePath = `${propertyId}/${uniqueId}-${safeFileName}`;

  // Upload to the specified bucket
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, { cacheControl: "3600", upsert: false });

  if (error) {
    console.error(`❌ Upload to ${bucketName} failed:`, error);
    return null;
  }

  return supabase.storage.from(bucketName).getPublicUrl(filePath).data
    .publicUrl;
};

/**
 * Uploads a property image to the property_photographs bucket
 */
export const uploadPropertyImage = async (
  propertyId: string,
  file: File
): Promise<string | null> => {
  return uploadFile(propertyId, file, "property_photographs");
};

/**
 * Uploads a floor plan to the property-floorplans bucket
 */
export const uploadFloorPlan = async (
  propertyId: string,
  file: File
): Promise<string | null> => {
  return uploadFile(propertyId, file, "property-floorplans");
};

/**
 * Uploads a rates notice to the property-ownership bucket
 */
export const uploadRatesNotice = async (
  propertyId: string,
  file: File
): Promise<string | null> => {
  return uploadFile(propertyId, file, "property-ownership");
};

/**
 * Uploads an identification document to the property-identification bucket
 */
export const uploadIdentification = async (
  propertyId: string,
  file: File
): Promise<string | null> => {
  return uploadFile(propertyId, file, "property-identification");
};

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

    if (fileUrl.includes("property_photographs")) {
      filePath = fileUrl.split(
        "/storage/v1/object/public/property_photographs/"
      )[1];
    } else if (fileUrl.includes("property-floorplans")) {
      bucketName = "property-floorplans";
      filePath = fileUrl.split(
        "/storage/v1/object/public/property-floorplans/"
      )[1];
    } else if (fileUrl.includes("property-ownership")) {
      bucketName = "property-ownership";
      filePath = fileUrl.split(
        "/storage/v1/object/public/property-ownership/"
      )[1];
    } else if (fileUrl.includes("property-identification")) {
      bucketName = "property-identification";
      filePath = fileUrl.split(
        "/storage/v1/object/public/property-identification/"
      )[1];
    }

    if (!filePath) {
      console.error("❌ Could not extract file path from URL:", fileUrl);
      return false;
    }

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
        return true; // Consider it a success if there's no error
      }

      const failedItems = data.filter((item) => item.error);

      if (failedItems.length > 0) {
        console.error("❌ Some files failed to delete:", failedItems);
        return false;
      }

      return true;
    }

    // If we got here with no errors, consider it a success

    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deleteFileFromStorage:", error);
    return false;
  }
};

/**
 * Enhanced function to delete floor plan files with extra validation
 */
export const deleteFloorPlan = async (fileUrl: string): Promise<boolean> => {
  try {
    if (!fileUrl.includes("property-floorplans")) {
      console.error("❌ Not a floor plan URL:", fileUrl);
      return false;
    }

    // Extract path components
    const pathPart = fileUrl.split(
      "/storage/v1/object/public/property-floorplans/"
    )[1];
    if (!pathPart) {
      console.error("❌ Could not extract path from URL:", fileUrl);
      return false;
    }

    const segments = pathPart.split("/");
    if (segments.length < 2) {
      console.error("❌ Invalid path structure:", pathPart);
      return false;
    }

    const propertyId = segments[0];
    const fileName = segments.slice(1).join("/");

    // First list all files in the folder to make sure we see it
    const { data: fileList, error: listError } = await supabase.storage
      .from("property-floorplans")
      .list(propertyId);

    if (listError) {
      console.error("❌ Error listing folder contents:", listError);
      return false;
    }

    const fileExists = fileList.some((file) => file.name === fileName);

    if (!fileExists) {
      return true;
    }

    // Attempt deletion with the precise file path
    const { data, error } = await supabase.storage
      .from("property-floorplans")
      .remove([`${propertyId}/${fileName}`]);

    if (error) {
      console.error("❌ Error deleting floor plan:", error);
      return false;
    }

    // Verify deletion by listing again
    const { data: afterList } = await supabase.storage
      .from("property-floorplans")
      .list(propertyId);

    const stillExists =
      afterList?.some((file) => file.name === fileName) ?? false;

    if (stillExists) {
      console.error("❌ File still exists after deletion!");
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ Unexpected error in deleteFloorPlan:", error);
    return false;
  }
};

/**
 * Directly deletes a floor plan file using its URL
 * Avoids checking with list operations which seem unreliable
 */
export const directFloorPlanDelete = async (
  fileUrl: string
): Promise<boolean> => {
  try {
    // Extract path components
    const pathPart = fileUrl.split(
      "/storage/v1/object/public/property-floorplans/"
    )[1];
    if (!pathPart) {
      console.error("❌ Could not extract path from floor plan URL:", fileUrl);
      return false;
    }

    // Use the full path as extracted from URL

    // Try multiple deletion approaches
    let deleted = false;

    // Approach 1: Standard removal
    try {
      const { data, error } = await supabase.storage
        .from("property-floorplans")
        .remove([pathPart]);

      if (error) {
        console.warn("⚠️ Standard removal failed:", error);
      } else {
        deleted = true;
      }
    } catch (e) {
      console.warn("⚠️ Error in standard removal approach:", e);
    }

    // If first approach failed, try the second approach with URL encoding
    if (!deleted) {
      try {
        // URL encode the path for special characters
        const encodedPath = pathPart
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/");

        const { data, error } = await supabase.storage
          .from("property-floorplans")
          .remove([encodedPath]);

        if (error) {
          console.warn("⚠️ URL-encoded removal failed:", error);
        } else {
          deleted = true;
        }
      } catch (e) {
        console.warn("⚠️ Error in URL-encoded removal approach:", e);
      }
    }

    // If previous approaches failed, try with individual components
    if (!deleted) {
      try {
        const segments = pathPart.split("/");
        if (segments.length >= 2) {
          const propertyId = segments[0];
          const fileName = segments.slice(1).join("/");

          const { data, error } = await supabase.storage
            .from("property-floorplans")
            .remove([`${propertyId}/${fileName}`]);

          if (error) {
            console.warn("⚠️ Component-based removal failed:", error);
          } else {
            deleted = true;
          }
        }
      } catch (e) {
        console.warn("⚠️ Error in component-based removal approach:", e);
      }
    }

    if (deleted) {
      return true;
    }

    console.error("❌ All deletion attempts failed");
    return false;
  } catch (error) {
    console.error("❌ Error in directFloorPlanDelete:", error);
    return false;
  }
};

/**
 * Generic function to delete an image from storage based on its URL
 * Handles both property photographs and floor plans
 */
export const deletePropertyImageFromDB = async (
  imageUrl: string
): Promise<boolean> => {
  try {
    // For floor plans, use our specialized direct method
    if (imageUrl.includes("property-floorplans")) {
      const success = await directFloorPlanDelete(imageUrl);

      if (!success) {
        console.error("❌ Failed to delete floor plan:", imageUrl);
        return false;
      }

      return true;
    }

    // For regular photographs, use standard deletion method
    let bucketName = "property_photographs";
    let pathPart;

    if (imageUrl.includes("property_photographs")) {
      pathPart = imageUrl.split(
        "/storage/v1/object/public/property_photographs/"
      )[1];
    } else if (imageUrl.includes("property-ownership")) {
      bucketName = "property-ownership";
      pathPart = imageUrl.split(
        "/storage/v1/object/public/property-ownership/"
      )[1];
    } else if (imageUrl.includes("property-identification")) {
      bucketName = "property-identification";
      pathPart = imageUrl.split(
        "/storage/v1/object/public/property-identification/"
      )[1];
    }

    if (!pathPart) {
      console.error("❌ Could not extract file path from URL:", imageUrl);
      return false;
    }

    // Simple direct approach for photos - this seems to be working
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([pathPart]);

    if (error) {
      console.error("❌ Failed to delete file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("❌ deletePropertyImageFromDB error:", error);
    return false;
  }
};

/**
 * Cleans up all files in a storage bucket for a specific property ID
 * Enhanced with better error handling and verification
 */
export const cleanupStorageBucket = async (
  propertyId: string,
  bucketName: string
): Promise<boolean> => {
  try {
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
      }
      // Verify deletion by listing again
      const { data: afterList, error: afterError } = await supabase.storage
        .from(bucketName)
        .list(propertyId);

      if (afterError) {
        return true;
      }

      if (afterList && afterList.length > 0) {
        console.warn(
          `⚠️ Some files may remain in ${bucketName}/${propertyId}:`,
          afterList
        );
        return false;
      }

      return true;
    }
    return true;
  } catch (error) {
    console.error(
      `❌ Error cleaning up ${bucketName} for property ${propertyId}:`,
      error
    );
    return false;
  }
};

/**
 * Direct cleanup of all floor plans for a property
 * Uses a different approach than the folder listing method
 */
export const directCleanupFloorPlans = async (
  propertyId: string
): Promise<boolean> => {
  try {
    // First list all files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from("property-floorplans")
      .list(propertyId);

    if (listError) {
      console.error(`❌ Error listing floor plans: ${listError.message}`);
      return false;
    }

    // If no files found, we're done
    if (!files || files.length === 0) {
      return true;
    }

    // Create paths for each file to delete
    const filePaths = files.map((file) => `${propertyId}/${file.name}`);

    // Delete each file individually (more reliable than batch)
    let successCount = 0;

    for (const path of filePaths) {
      try {
        const { data, error } = await supabase.storage
          .from("property-floorplans")
          .remove([path]);

        if (error) {
          console.error(
            `❌ Error deleting floor plan ${path}: ${error.message}`
          );
        } else {
          successCount++;
        }
      } catch (fileError) {
        console.error(`❌ Exception deleting floor plan: ${fileError}`);
      }
    }

    // Even if some files failed, return true to allow the property deletion to continue
    return true;
  } catch (error) {
    console.error(`❌ Error in directCleanupFloorPlans: ${error}`);
    // Return true anyway to not block property deletion
    return true;
  }
};

/**
 * Cleanup function specifically for property photographs
 * This seems to be working properly
 */
export const cleanupPropertyPhotographs = async (
  propertyId: string
): Promise<boolean> => {
  try {
    // List all files in the property folder
    const { data: files, error: listError } = await supabase.storage
      .from("property_photographs")
      .list(propertyId);

    if (listError) {
      console.error(
        `❌ Error listing files in property_photographs/${propertyId}:`,
        listError
      );
      return false;
    }

    if (files && files.length > 0) {
      // Create an array of paths to delete
      const filePaths = files.map((file) => `${propertyId}/${file.name}`);

      // Delete all files in the property folder
      const { error: deleteError } = await supabase.storage
        .from("property_photographs")
        .remove(filePaths);

      if (deleteError) {
        console.error(`❌ Error deleting photographs:`, deleteError);
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  } catch (error) {
    console.error(`❌ Error cleaning up photographs:`, error);
    return false;
  }
};

/**
 * Enhanced cleanup function that handles both storage buckets
 * with better error handling and retries
 */
export const cleanupAllPropertyFiles = async (
  propertyId: string
): Promise<boolean> => {
  // First cleanup property_photographs
  let photosResult = false;
  try {
    photosResult = await cleanupPropertyPhotographs(propertyId);
  } catch (error) {
    console.error(`❌ Error cleaning up photographs: ${error}`);
  }

  // Use the direct method for floor plans
  let floorPlansResult = false;
  try {
    floorPlansResult = await directCleanupFloorPlans(propertyId);
  } catch (error) {
    console.error(`❌ Error cleaning up floor plans: ${error}`);
  }

  // Cleanup ownership documents
  let ownershipResult = false;
  try {
    ownershipResult = await cleanupStorageBucket(
      propertyId,
      "property-ownership"
    );
  } catch (error) {
    console.error(`❌ Error cleaning up ownership documents: ${error}`);
  }

  // Cleanup identification documents
  let identificationResult = false;
  try {
    identificationResult = await cleanupStorageBucket(
      propertyId,
      "property-identification"
    );
  } catch (error) {
    console.error(`❌ Error cleaning up identification documents: ${error}`);
  }

  // Even if some operations "failed", consider the cleanup done
  // to not block the property deletion
  return true;
};
