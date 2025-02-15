import type { StateCreator } from "zustand";
import type { SessionState, User } from "../types";

export const createSessionSlice: StateCreator<
  SessionState,
  [],
  [],
  SessionState
> = (set) => ({
  authToken: null,
  isAuthenticated: false,
  user: null, // ✅ Store full user info

  setSession: (user: User) => {
    set({
      authToken: user.id,
      isAuthenticated: true,
      user, // ✅ Store user details
    });
  },

  clearSession: () => {
    set({
      authToken: null,
      isAuthenticated: false,
      user: null, // ✅ Clear user info on logout
    });
  },
});
