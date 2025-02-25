import type { StateCreator } from "zustand";
import type { Database } from "../../database/database_types";
import type { ProfileState } from "../types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const createProfileSlice: StateCreator<ProfileState> = (set) => ({
  profile: null, // ✅ Store `user` as a single object

  setProfile: (profile: Profile) => set({ profile: profile }), // ✅ Updates the full `user` object

  clearProfile: () => set({ profile: null }), // ✅ Clears user state
});
