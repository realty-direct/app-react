import type { Database } from "../database/database_types";

// Define the UserState interface

export type User = Database["public"]["Tables"]["profiles"]["Row"];

export interface UserState extends User {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface SessionState {
  user: User | null;
  setSession: (user: User) => void;
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
}
