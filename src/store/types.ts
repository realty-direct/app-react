import type { Session } from "@supabase/supabase-js";
import type { Database } from "../database/database_types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type PropertyDetail = Omit<
  Database["public"]["Tables"]["property_details"]["Row"],
  "images"
> & {
  images:
    | Database["public"]["Tables"]["property_details"]["Row"]["images"]
    | null;
};
export type PropertyFeature =
  Database["public"]["Tables"]["property_features"]["Row"];

// ✅ Define Zustand store types

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
  clearProperties: () => void;
}

// ✅ PropertyDetailsState supports multiple property details
export interface PropertyDetailsState {
  propertyDetails: PropertyDetail[];
  setPropertyDetails: (details: PropertyDetail[]) => void;
  updatePropertyDetail: (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => void;
  createPropertyDetail: (propertyId: string, propertyCategory: string) => void;

  setPropertyImages: (
    data: { property_id: string; images: PropertyDetail["images"] }[]
  ) => void;
  setMainImage: (propertyId: string, mainImageUrl: string) => void;
}

// ✅ Define Zustand Store for Property Features
export interface PropertyFeaturesState {
  propertyFeatures: (PropertyFeature | Omit<PropertyFeature, "id">)[];
  setPropertyFeatures: (features: PropertyFeature[]) => void;
  clearPropertyFeatures: () => void;
  toggleFeatureSelection: (
    propertyId: string,
    feature: Omit<PropertyFeature, "id">
  ) => void;
}
