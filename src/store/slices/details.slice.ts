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
    const newDetail: Partial<PropertyDetail> = {
      property_id: propertyId,
      property_category: propertyCategory,
      images: [],
      floor_plans: [],
    };

    set((state) => ({
      propertyDetails: [...state.propertyDetails, newDetail as PropertyDetail],
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
        property.property_id === propertyId
          ? { ...property, images, main_image: images[0]?.url || null } // ✅ Ensure first image is main
          : property
      ),
    }));
  },

  updateOwnershipDocument: (propertyId: string, documentUrl: string | null) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, ownership_document: documentUrl }
          : property
      ),
    }));
  },

  updateIdentificationDocument: (
    propertyId: string,
    documentUrl: string | null
  ) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, identification_document: documentUrl }
          : property
      ),
    }));
  },

  updateOwnershipVerification: (propertyId: string, isVerified: boolean) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, ownership_verified: isVerified }
          : property
      ),
    }));
  },

  deletePropertyDetail: (propertyId: string) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.filter(
        (detail) => detail.property_id !== propertyId
      ),
    }));
  },

  setPropertyImages: (data: { property_id: string; images: Json | null }[]) => {
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
  },

  updatePropertyPackage: (
    propertyId: string,
    packageType: "ESSENTIAL" | "ADVANTAGE" | "PREMIUM" | null
  ) => {
    set((state) => ({
      propertyDetails: state.propertyDetails.map((property) =>
        property.property_id === propertyId
          ? { ...property, property_package: packageType }
          : property
      ),
    }));
  },
});
