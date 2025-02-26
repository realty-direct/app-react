import type { StateCreator } from "zustand";
import { supabase } from "../../database/supabase";
import type { Profile, ProfileState } from "../types";

export const createProfileSlice: StateCreator<ProfileState> = (set) => ({
  profile: null,

  setProfile: (profile: Profile) => set({ profile }),

  clearProfile: () => set({ profile: null }),

  fetchUserProfile: async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }

      set({ profile });
    } catch (error) {
      console.error("fetchUserProfile error:", error);
    }
  },
});
