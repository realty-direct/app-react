// userSessionSlice.ts
import type { StateCreator } from "zustand";
import type { StoreState } from "../store";
import type { User, UserSessionState } from "../types";



export const createUserSessionSlice: StateCreator<
  StoreState,
  [],
  [],
  UserSessionState
> = (set) => ({
  user: null,
  token: null,
  setUserSession: (user: User, token: string) => set({ user, token }),
  clearUserSession: () => set({ user: null, token: null }),
});
