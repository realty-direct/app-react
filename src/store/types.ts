import type { Database } from "../database/database_types";

// Define the UserState interface
export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
}

export interface UserState extends User {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface SessionState {
  authToken: string | null;
  isAuthenticated: boolean;
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
