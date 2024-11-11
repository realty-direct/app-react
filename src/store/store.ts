// store.ts
import { create } from "zustand";
import { createPropertiesSlice } from "./slices/properties.slice";
import { createUserSessionSlice } from "./slices/session.slice";
import type { PropertiesState, UserSessionState } from "./types";

export type StoreState = UserSessionState & PropertiesState;

const useStore = create<StoreState>((set, get, api) => ({
  ...createUserSessionSlice(set, get, api),
  ...createPropertiesSlice(set, get, api),
}));

export default useStore;
