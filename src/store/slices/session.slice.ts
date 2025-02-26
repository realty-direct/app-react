import type { StateCreator } from "zustand";
import type { SessionState } from "../types";

export const createSessionSlice: StateCreator<SessionState> = (set) => ({
  session: null,

  setSession: (session) => {
    set({ session }); // ✅ Only update session state (don't fetch profile or properties)
  },

  clearSession: () => {
    set({ session: null });
  },
});
