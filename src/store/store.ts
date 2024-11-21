// store.ts
import { create } from "zustand";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createSessionSlice } from "./slices/session.slice";
import { createUserSlice } from "./slices/user.slice";
import type { PropertiesState, SessionState, UserState } from "./types";

export type StoreState = UserState & PropertiesState & SessionState;

const useStore = create<StoreState>((set) => ({
  ...createUserSlice(set),
  ...createPropertiesSlice(set),
  ...createSessionSlice(set),
}));

export default useStore;
