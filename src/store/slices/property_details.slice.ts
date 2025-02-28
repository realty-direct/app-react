import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
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
  ): Promise<void> => {
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

  fetchUserPropertyDetail: async (propertyId: string): Promise<void> => {
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

      set((state) => {
        const existingIndex = state.propertyDetails.findIndex(
          (detail) => detail.property_id === propertyId
        );

        if (existingIndex !== -1) {
          const updatedDetails = [...state.propertyDetails];
          updatedDetails[existingIndex] = data;
          return { propertyDetails: updatedDetails };
        }

        return { propertyDetails: [...state.propertyDetails, data] };
      });
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
        .update(detailsToUpdate)
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
});
