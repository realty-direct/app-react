// src/store/store.ts
import create from "zustand";
import { AppState } from "./AppTypes";

const useStore = create<AppState>((set) => ({
  user: null,
  properties: [],

  // Login function to authenticate the user and fetch initial properties
  login: async (credentials) => {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const userData = await response.json();
    set({ user: userData });

    // Fetch properties after login
    await useStore.getState().fetchProperties();
  },

  logout: () => set({ user: null, properties: [] }),

  // Fetch all properties for the logged-in user
  fetchProperties: async () => {
    const { user } = useStore.getState();
    if (user) {
      const response = await fetch(`/api/properties?userId=${user.id}`);
      const propertiesData = await response.json();
      set({ properties: propertiesData });
    }
  },

  // Update a specific property and sync with the server
  updateProperty: async (propertyId, updates) => {
    const response = await fetch(`/api/properties/${propertyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updatedProperty = await response.json();

    // Update the property in the state
    set((state) => ({
      properties: state.properties.map((prop) =>
        prop.id === propertyId ? updatedProperty : prop
      ),
    }));
  },
}));

export default useStore;
