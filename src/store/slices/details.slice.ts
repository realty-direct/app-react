import type { StateCreator } from "zustand";
import type { Json } from "../../database/database_types";
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

  updateImageOrder: (propertyId: string, images: { url: string }[]) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId ? { ...property, images } : property
      ),
    }));

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
});
