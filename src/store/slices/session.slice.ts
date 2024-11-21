import type { StateCreator } from "zustand";
import type { SessionState } from "../types";

export const createSessionSlice: StateCreator<SessionState> = (set) => ({
  authToken: null,
  isAuthenticated: false,
  setSession: (token) =>
    set(() => ({ authToken: token, isAuthenticated: !!token })),
  clearSession: () => set(() => ({ authToken: null, isAuthenticated: false })),
});
