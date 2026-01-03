import { create } from "zustand";
import type { SessionState } from "../types/types";

export const UseSessionStore = create<SessionState>((set) => ({
  sessionReady: false,
  setSessionReady: (isReady) => set({ sessionReady: isReady }),
}));
