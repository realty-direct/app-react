import type { Session } from "@supabase/supabase-js";
import type { Database } from "../database/database_types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

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

export type Property = Database["public"]["Tables"]["properties"]["Row"];

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
