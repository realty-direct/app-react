/* eslint-disable @typescript-eslint/no-explicit-any */
// ! WARNING: Be careful of any type in this file, had to add this here because of Biome and ESLint.

import { create } from "zustand";
import { signIn, supabase } from "../lib/supabase"; // ✅ Import Supabase client
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

// ✅ Restore session from localStorage on reload
if (typeof window !== "undefined") {
  const savedSession = localStorage.getItem("realtyAuthSession");
  if (savedSession) {
    useRealtyStore.getState().setSession(JSON.parse(savedSession));
  }
}

// ✅ Expose Zustand store to the window object for debugging
if (import.meta.env.MODE === "development" && typeof window !== "undefined") {
  // biome-ignore lint/suspicious/noExplicitAny: Suppress Biome warning
  (window as any).store = {
    getState: useRealtyStore.getState, // ✅ View store state in console
    setState: useRealtyStore.setState, // ✅ Modify store state in console
    resetState: () => {
      localStorage.removeItem("realtyAuthSession"); // ✅ Remove saved session
      useRealtyStore.setState(useRealtyStore.getState());
    },

    // ✅ Auto-Login Function (Requires Both Username & Password)
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

      const { user, error } = await signIn(username, password);

      if (error) {
        console.error(
          "%c❌ Auto-login failed:",
          "color: red; font-weight: bold;",
          error.message
        );
        return;
      }

      if (user) {
        // ✅ Fetch user profile from the `profiles` table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name")
          .eq("id", user.id)
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
          id: user.id,
          fname: profile?.first_name || "Unknown",
          lname: profile?.last_name || "User",
          email: user.email ?? "",
        };

        useRealtyStore.getState().setSession(sessionData);

        // ✅ Store session in localStorage so it persists after refresh
        localStorage.setItem("realtyAuthSession", JSON.stringify(sessionData));

        // ✅ Redirect the user to the homepage
        window.location.href = "/";
      }
    },
  };
}

export default useRealtyStore;
