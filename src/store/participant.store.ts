import { create } from "zustand";
import type { Participants } from "../types/types";

interface ParticipantsState {
  participants: Participants[];
  setParticipants: (participants: Participants[]) => void;
  addParticipant: (participant: Participants) => void;
  removeParticipant: (userId: string) => void;
}

export const useParticipantsStore = create<ParticipantsState>((set) => ({
  participants: [],
  setParticipants: (participants) => set({ participants }),
  addParticipant: (participant) =>
    set((state) => ({
      participants: [...state.participants, participant],
    })),

  removeParticipant: (userId) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.userId !== userId),
    })),
}));
