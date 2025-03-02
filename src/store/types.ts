import type { Session } from "@supabase/supabase-js";
import type { Database } from "../database/database_types";

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
  fetchUserProfile: (userId: string) => Promise<void>; // ✅ Moved to ProfileState
}

export interface SessionState {
  session: Session | null;
  setSession: (session: Session | null) => void;
  clearSession: () => void;
}

export interface PropertiesState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  fetchUserProperties: (userId: string) => Promise<void>;
  addProperty: (
    newProperty: Omit<Property, "id" | "created_at">
  ) => Promise<string | null>;
  deleteProperty: (id: string) => Promise<void>;
  clearProperties: () => void;
}

// ✅ Updated PropertyDetailsState to support multiple property details
export interface PropertyDetailsState {
  propertyDetails: PropertyDetail[];
  setPropertyDetails: (details: PropertyDetail[]) => void;
  updatePropertyDetail: (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => Promise<void>;
  updatePropertyDetailInStore: (
    propertyId: string,
    updates: Partial<PropertyDetail>
  ) => void;
  fetchUserPropertyDetails: (propertyIds: string[]) => Promise<void>;
  fetchUserPropertyDetail: (propertyId: string) => Promise<void>;
  savePropertyDetails: (propertyId: string) => Promise<void>;
}

// ✅ Define Zustand State for Property Features
export interface PropertyFeaturesState {
  propertyFeatures: PropertyFeature[];
  setPropertyFeatures: (features: PropertyFeature[]) => void;
  clearPropertyFeatures: () => void;
  toggleFeatureSelection: (
    propertyId: string,
    feature: PropertyFeature
  ) => void; // 🔥 Modified to work per property
  savePropertyFeatures: (propertyId: string) => Promise<void>;
}
