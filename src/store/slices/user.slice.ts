import type { StateCreator } from "zustand";
import type { UserState } from "../types";

// User Slice Creator
export const createUserSlice: StateCreator<UserState> = (set) => ({
  id: null,
  name: null,
  email: null,
  setUser: (user) =>
    set(() => ({ id: user.id, name: user.name, email: user.email })),
  clearUser: () => set(() => ({ id: null, name: null, email: null })),
});
