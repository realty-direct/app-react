import type { Session } from "@supabase/supabase-js";
import type { StateCreator } from "zustand";
import type { SessionState } from "../types";

export const createSessionSlice: StateCreator<SessionState> = (set) => ({
  session: null, // ✅ Zustand only tracks the session

  setSession: (session: Session | null) => {
    set({ session });
  },

  clearSession: () => {
    set({ session: null }); // ✅ Set user to `null` when logged out
  },
});
