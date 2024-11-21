// Define the UserState interface
export interface User {
  id: string | null;
  name: string | null;
  email: string | null;
}

export interface UserState extends User {
  setUser: (user: User) => void;
  clearUser: () => void;
}

export interface SessionState {
  authToken: string | null;
  isAuthenticated: boolean;
  setSession: (token: string) => void;
  clearSession: () => void;
}

export interface Property {
  id: string;
  name: string;
}

export interface PropertiesState {
  properties: Property[];
  selectedProperty: string | null;
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (id: string) => void;
  clearSelectedProperty: () => void;
}
