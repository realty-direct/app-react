import type { Session } from "@supabase/supabase-js";
import type { Database, Json } from "../database/database_types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyDetail =
  Database["public"]["Tables"]["property_details"]["Row"];
export type PropertyFeature =
  Database["public"]["Tables"]["property_features"]["Row"];

export interface ProfileState {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  clearProfile: () => void;
}

export interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

export interface PropertiesState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  addProperty: (newProperty: Property) => void;
  deleteProperty: (id: string) => Promise<void>;
  clearProperties: () => void;
}

// ✅ Updated PropertyDetailsState to support multiple property details
export interface PropertyDetailsState {
  propertyDetails: PropertyDetail[];
  setPropertyDetails: (details: PropertyDetail[]) => void;
  createPropertyDetail: (propertyId: string, propertyCategory: string) => void;
  updatePropertyDetail: (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => void;
  fetchUserPropertyDetail: (propertyId: string) => Promise<void>;
  savePropertyDetails: (propertyId: string) => Promise<void>;
  updateImageOrder: (
    propertyId: string,
    images: {
      url: string;
    }[]
  ) => void;
  setPropertyImages: (data: { property_id: string; images: Json[] }[]) => void;
  setMainImage: (propertyId: string, mainImageUrl: string) => void;
  deletePropertyImage: (
    propertyId: string,
    imageUrl: string
  ) => Promise<boolean>; // ✅ Ensure correct return type
}

// ✅ Define Zustand State for Property Features
export interface PropertyFeaturesState {
  propertyFeatures: PropertyFeature[];
  setPropertyFeatures: (features: PropertyFeature[]) => void;
  clearPropertyFeatures: () => void;
  toggleFeatureSelection: (
    propertyId: string,
    feature: Omit<PropertyFeature, "id"> // ✅ Accepts features without `id`
  ) => void;
  savePropertyFeatures: (propertyId: string) => Promise<void>;
}
