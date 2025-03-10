import type { StateCreator } from "zustand";
import { Json } from "../../database/database_types";
import { deletePropertyImage, supabase } from "../../database/supabase";
import type { PropertyDetail, PropertyDetailsState } from "../types";

export const createPropertyDetailsSlice: StateCreator<PropertyDetailsState> = (
  set,
  get
) => ({
  propertyDetails: [],

  setPropertyDetails: (details: PropertyDetail[]) =>
    set({ propertyDetails: details }),

  createPropertyDetail: (propertyId: string, propertyCategory: string) => {
    set((state) => ({
      propertyDetails: [
        ...state.propertyDetails,
        {
          property_id: propertyId,
          property_category: propertyCategory,
        } as PropertyDetail, // ✅ Type assertion to satisfy TypeScript
      ],
    }));
  },

  updatePropertyDetail: (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((detail) =>
        detail.property_id === propertyId ? { ...detail, ...updates } : detail
      ),
    }));
  },

  fetchUserPropertyDetail: async (propertyId: string) => {
    try {
      const { data, error } = await supabase
        .from("property_details")
        .select("*")
        .eq("property_id", propertyId)
        .single();

      if (error) {
        console.error(
          `❌ Error fetching property details for ${propertyId}:`,
          error
        );
        return;
      }

      set((state) => ({
        propertyDetails: [
          ...state.propertyDetails.filter((p) => p.property_id !== propertyId),
          data,
        ], // ✅ Keep it an array
      }));
    } catch (error) {
      console.error("❌ fetchUserPropertyDetail error:", error);
    }
  },

  savePropertyDetails: async (propertyId: string): Promise<void> => {
    try {
      const { propertyDetails } = get();
      const detailsToUpdate = propertyDetails.find(
        (d) => d.property_id === propertyId
      );
      if (!detailsToUpdate) return;

      const { error } = await supabase
        .from("property_details")
        .update(detailsToUpdate) // ✅ Sends the full object, including `undefined` values
        .eq("property_id", propertyId);

      if (error) {
        console.error("❌ Error saving property details:", error);
        return;
      }

      console.log("✅ Property details saved successfully!");
    } catch (error) {
      console.error("❌ savePropertyDetails error:", error);
    }
  },
  updateImageOrder: (propertyId: string, images: { url: string }[]) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId ? { ...property, images } : property
      ),
    }));

    // ✅ Save new order to Supabase
    get().updatePropertyDetail(propertyId, { images });
  },

  setMainImage: (propertyId: string, mainImageUrl: string) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, main_image: mainImageUrl }
          : property
      ),
    }));

    // ✅ Save main image to Supabase
    get().updatePropertyDetail(propertyId, { main_image: mainImageUrl });
  },
  setPropertyImages: (data: { property_id: string; images: Json | null }[]) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) => {
        const propertyData = data.find(
          (img) => img.property_id === property.property_id
        );
        return propertyData
          ? { ...property, images: (propertyData.images as Json) || [] } // ✅ Ensure images type matches Json
          : property;
      }),
    }));
  },

  deletePropertyImage: async (
    propertyId: string,
    imageUrl: string
  ): Promise<boolean> => {
    const success = await deletePropertyImage(imageUrl);
    if (!success) return false; // ✅ Ensure it returns a boolean

    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) => {
        if (property.property_id !== propertyId) return property;

        const currentImages = Array.isArray(property.images)
          ? property.images.filter(
              (img): img is { url: string } =>
                img !== null &&
                typeof img === "object" &&
                "url" in img &&
                typeof img.url === "string" &&
                img.url !== imageUrl
            )
          : [];

        return {
          ...property,
          images: currentImages,
        };
      }),
    }));

    const updatedImages =
      get().propertyDetails.find((p) => p.property_id === propertyId)?.images ??
      [];
    await get().updatePropertyDetail(propertyId, { images: updatedImages });

    return true; // ✅ Return `true` to match expected return type
  },
});
