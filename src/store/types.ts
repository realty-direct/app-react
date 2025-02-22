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

export interface Property {
  id: string;
  user_id: string;
  address: string;
  property_type: "residential" | "commercial" | "land" | "rural";
  sale_type?: "standard_sale" | "auction";
  price?: number;
  price_display?: "same_as_price" | "hide" | "range" | "custom";
  status: "draft" | "published" | "sold";
  created_at: string;
}

export interface PropertiesState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  fetchProperties: (userId: string) => Promise<void>;
  addProperty: (
    newProperty: Omit<Property, "id" | "created_at">
  ) => Promise<string | null>;
  deleteProperty: (id: string) => Promise<void>;
}
