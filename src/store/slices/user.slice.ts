import type { StateCreator } from "zustand";
import type { Database } from "../../database/database_types"; // ✅ Import generated Supabase types
import type { UserState } from "../types"; // ✅ Import Zustand state type

// ✅ Define User type based on Supabase `profiles` table
export type User = Database["public"]["Tables"]["profiles"]["Row"];

export const createUserSlice: StateCreator<UserState> = (set) => ({
  id: "", // ✅ TypeScript safe initial state
  first_name: "", // ✅ Match `profiles` table
  last_name: "",
  email: "",

  // ✅ Set user info from Supabase profile
  setUser: (user: User) =>
    set(() => ({
      id: user.id,
      first_name: user.first_name, // ✅ Match `profiles` table
      last_name: user.last_name,
      email: user.email,
    })),

  // ✅ Clear user state on logout
  clearUser: () =>
    set(() => ({
      id: "",
      first_name: "",
      last_name: "",
      email: "",
    })),
});
