// userSessionSlice.ts
import type { StateCreator } from "zustand";
import { StoreState } from "../store";
import type { User } from "../types";

export interface UserSessionState {
  user: User | null;
  token: string | null;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
}

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
