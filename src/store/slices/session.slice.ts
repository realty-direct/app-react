import type { StateCreator } from "zustand";
import { supabase } from "../../lib/supabase";
import type { SessionState } from "../types";

export const createSessionSlice: StateCreator<
  SessionState,
  [],
  [],
  SessionState
> = (set) => ({
  authToken: null,
  isAuthenticated: false,

  setSession: async (token) => {
    set({ authToken: token, isAuthenticated: true });
  },

  clearSession: async () => {
    await supabase.auth.signOut();
    set({ authToken: null, isAuthenticated: false });
  },
});
