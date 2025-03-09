import type { StateCreator } from "zustand";
import { deletePropertyImage, supabase } from "../../database/supabase";
import type { PropertyDetail, PropertyDetailsState } from "../types";

export const createPropertyDetailsSlice: StateCreator<PropertyDetailsState> = (
  set,
  get
) => ({
  propertyDetails: [],

  setPropertyDetails: (details: PropertyDetail[]) =>
    set({ propertyDetails: details }),

  updatePropertyDetail: async (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => {
    try {
      const { error } = await supabase
        .from("property_details")
        .update(updates)
        .eq("property_id", propertyId);

      if (error) {
        console.error("❌ Error updating property details:", error);
        return;
      }

      // ✅ Fetch updated details and update Zustand store
      await get().fetchUserPropertyDetail(propertyId);
    } catch (error) {
      console.error("❌ updatePropertyDetail error:", error);
    }
  },

  updatePropertyDetailInStore: (propertyId, updates) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, ...updates }
          : property
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

  fetchUserPropertyDetails: async (propertyIds: string[]): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("property_details")
        .select("*")
        .in("property_id", propertyIds);

      if (error) {
        console.error("❌ Error fetching property details:", error);
        return;
      }

      set({ propertyDetails: data || [] });
    } catch (error) {
      console.error("❌ fetchUserPropertyDetails error:", error);
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
  fetchPropertyImages: async (propertyIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from("property_details")
        .select("property_id, images")
        .in("property_id", propertyIds);

      if (error) {
        console.error("❌ Error fetching images:", error);
        return;
      }

      // ✅ Update Zustand store correctly using `set()`
      set((state) => ({
        propertyDetails: state.propertyDetails.map((property) => {
          const propertyData = data.find(
            (img) => img.property_id === property.property_id
          );
          return propertyData
            ? { ...property, images: propertyData.images || [] }
            : property;
        }),
      }));
    } catch (error) {
      console.error("❌ fetchPropertyImages error:", error);
    }
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
