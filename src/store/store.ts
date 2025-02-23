import { create } from "zustand";
import { supabase } from "../database/supabase"; // ✅ Import Supabase client
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createUserSlice } from "./slices/user.slice";
import type { PropertiesState, SessionState, UserState } from "./types";

export type StoreState = UserState & PropertiesState & SessionState;

export const useRealtyStore = create<StoreState>((set, get, api) => ({
  ...createUserSlice(set, get, api),
  ...createPropertiesSlice(set, get, api),
  ...createSessionSlice(set, get, api),
}));

// ✅ Expose Zustand store to the window object for debugging
if (import.meta.env.MODE === "development" && typeof window !== "undefined") {
  (window as any).store = {
    getState: useRealtyStore.getState,
    setState: useRealtyStore.setState,

    // ✅ Auto-Login Function
    autoLogin: async (username: string, password: string) => {
      if (!username || !password) {
        console.error(
          "%c❌ Error: Username and password are required.",
          "color: red; font-weight: bold;"
        );
        return;
      }

      console.log(
        "%c🔄 Attempting auto-login...",
        "color: cyan; font-weight: bold;"
      );

      // ✅ Fix: Supabase returns `session`, not `user`
      const { data: session, error } = await supabase.auth.signInWithPassword({
        email: username,
        password,
      });

      if (error) {
        console.error(
          "%c❌ Auto-login failed:",
          "color: red; font-weight: bold;",
          error.message
        );
        return;
      }

      if (!session?.user) {
        console.error(
          "%c❌ No user found after login.",
          "color: red; font-weight: bold;"
        );
        return;
      }

      // ✅ Fetch user profile from the `profiles` table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        console.error(
          "%c❌ Failed to load user profile:",
          "color: red; font-weight: bold;",
          profileError.message
        );
        return;
      }

      // ✅ Store the full user info in Zustand
      const sessionData = {
        id: session.user.id,
        email: session.user.email ?? "",
        first_name: profile?.first_name || "Unknown",
        last_name: profile?.last_name || "User",
      };

      useRealtyStore.getState().setSession(sessionData);
      localStorage.setItem("realtyAuthSession", JSON.stringify(sessionData));

      // ✅ Redirect the user to the homepage
      window.location.href = "/";
    },
  };
}

export default useRealtyStore;
