export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Property {
  id: string;
  address: string;
  description: string;
  price: number;
  // Add other relevant fields
}

export interface PropertiesState {
  properties: Property[];
  fetchProperties: () => Promise<void>;
}

export interface UserSessionState {
  user: User | null;
  token: string | null;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
}
