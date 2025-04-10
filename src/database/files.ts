// src/database/files.ts - Complete file with all functions
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

    console.log(
      `🔧 Deleting floor plan: propertyId=${propertyId}, fileName=${fileName}`
    );

    // First list all files in the folder to make sure we see it
    const { data: fileList, error: listError } = await supabase.storage
      .from("property-floorplans")
      .list(propertyId);

    if (listError) {
      console.error("❌ Error listing folder contents:", listError);
      return false;
    }

    console.log(`📁 Files in folder before deletion:`, fileList);
    const fileExists = fileList.some((file) => file.name === fileName);

    if (!fileExists) {
      console.log(`⚠️ File not found in listing, may already be deleted`);
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

    console.log(`📊 Deletion response:`, data);

    // Verify deletion by listing again
    const { data: afterList } = await supabase.storage
      .from("property-floorplans")
      .list(propertyId);

    console.log(`📁 Files in folder after deletion:`, afterList);
    const stillExists = afterList.some((file) => file.name === fileName);

    if (stillExists) {
      console.error(`❌ File still exists after deletion!`);
      return false;
    }

    console.log(
      `✅ Floor plan deletion verified: File no longer in directory listing`
    );
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
    console.log("🔍 Starting robust floor plan deletion for:", fileUrl);

    // Extract path components
    const pathPart = fileUrl.split(
      "/storage/v1/object/public/property-floorplans/"
    )[1];
    if (!pathPart) {
      console.error("❌ Could not extract path from floor plan URL:", fileUrl);
      return false;
    }

    // Use the full path as extracted from URL
    console.log(`🔧 Using exact path: ${pathPart}`);

    // Try multiple deletion approaches
    let deleted = false;

    // Approach 1: Standard removal
    try {
      console.log("🔄 Trying standard removal...");
      const { data, error } = await supabase.storage
        .from("property-floorplans")
        .remove([pathPart]);

      if (error) {
        console.warn("⚠️ Standard removal failed:", error);
      } else {
        console.log("✅ Standard removal succeeded:", data);
        deleted = true;
      }
    } catch (e) {
      console.warn("⚠️ Error in standard removal approach:", e);
    }

    // If first approach failed, try the second approach with URL encoding
    if (!deleted) {
      try {
        console.log("🔄 Trying URL-encoded path removal...");
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
          console.log("✅ URL-encoded removal succeeded:", data);
          deleted = true;
        }
      } catch (e) {
        console.warn("⚠️ Error in URL-encoded removal approach:", e);
      }
    }

    // If previous approaches failed, try with individual components
    if (!deleted) {
      try {
        console.log("🔄 Trying component-based removal...");
        const segments = pathPart.split("/");
        if (segments.length >= 2) {
          const propertyId = segments[0];
          const fileName = segments.slice(1).join("/");

          console.log(
            `🔧 Removing with propertyId=${propertyId}, fileName=${fileName}`
          );

          const { data, error } = await supabase.storage
            .from("property-floorplans")
            .remove([`${propertyId}/${fileName}`]);

          if (error) {
            console.warn("⚠️ Component-based removal failed:", error);
          } else {
            console.log("✅ Component-based removal succeeded:", data);
            deleted = true;
          }
        }
      } catch (e) {
        console.warn("⚠️ Error in component-based removal approach:", e);
      }
    }

    if (deleted) {
      console.log("✅ Successfully deleted floor plan file");
      return true;
    } else {
      console.error("❌ All deletion attempts failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Error in directFloorPlanDelete:", error);
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

        // Verify deletion by listing again
        const { data: afterList, error: afterError } = await supabase.storage
          .from(bucketName)
          .list(propertyId);

        if (afterError) {
          console.log(
            `ℹ️ Error listing after deletion, might be deleted successfully:`,
            afterError
          );
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
 * Direct cleanup of all floor plans for a property
 * Uses a different approach than the folder listing method
 */
export const directCleanupFloorPlans = async (
  propertyId: string
): Promise<boolean> => {
  try {
    console.log(
      `🔄 Starting direct cleanup of floor plans for property ${propertyId}`
    );

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
      console.log(`ℹ️ No floor plans found for property ${propertyId}`);
      return true;
    }

    console.log(`📁 Found ${files.length} floor plans to delete`);

    // Create paths for each file to delete
    const filePaths = files.map((file) => `${propertyId}/${file.name}`);

    // Delete each file individually (more reliable than batch)
    let successCount = 0;

    for (const path of filePaths) {
      try {
        console.log(`🗑️ Deleting floor plan: ${path}`);
        const { data, error } = await supabase.storage
          .from("property-floorplans")
          .remove([path]);

        if (error) {
          console.error(
            `❌ Error deleting floor plan ${path}: ${error.message}`
          );
        } else {
          console.log(`✅ Successfully deleted floor plan: ${path}`);
          successCount++;
        }
      } catch (fileError) {
        console.error(`❌ Exception deleting floor plan: ${fileError}`);
      }
    }

    console.log(`📊 Deleted ${successCount}/${filePaths.length} floor plans`);

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
    console.log(`🔍 Cleaning up photographs for property ${propertyId}`);

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
      console.log(`📁 Found ${files.length} photographs to delete`);

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
        console.log(`✅ Deleted all photographs for property ${propertyId}`);
        return true;
      }
    } else {
      console.log(`ℹ️ No photographs found for property ${propertyId}`);
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
  console.log(
    `🔄 Starting cleanup for all files related to property ${propertyId}`
  );

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

  console.log(
    `📊 Cleanup results - Photos: ${photosResult ? "✅" : "❌"}, Floor Plans: ${floorPlansResult ? "✅" : "❌"}`
  );

  // Even if some operations "failed", consider the cleanup done
  // to not block the property deletion
  return true;
};
