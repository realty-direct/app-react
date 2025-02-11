import { create } from "zustand";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createUserSlice } from "./slices/user.slice";
import type { PropertiesState, SessionState, UserState } from "./types";

// ✅ Combine all Zustand slices into one global store
export type StoreState = UserState & PropertiesState & SessionState;

export const useStore = create<StoreState>((set, get, api) => ({
  ...createUserSlice(set, get, api),
  ...createSessionSlice(set, get, api),
  ...createPropertiesSlice(set, get, api),
}));

export default useStore;
