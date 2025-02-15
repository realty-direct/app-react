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
  name: string; // ✅ Ensure this matches Supabase
  title: string;
  price: number;
  description: string;
  created_at: string;
}

export interface PropertiesState {
  properties: Property[];
  setProperties: (properties: Property[]) => void;
}
