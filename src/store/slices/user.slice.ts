import type { StateCreator } from "zustand";
import type { Profile, ProfileState } from "../types";

export const createProfileSlice: StateCreator<ProfileState> = (set) => ({
  profile: null,

  setProfile: (profile: Profile) => set({ profile }),

  clearProfile: () => set({ profile: null }),
});
