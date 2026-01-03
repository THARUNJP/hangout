import { create } from "zustand";
import type { Participants, ParticipantsState } from "../types/types";


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

  updateParticipant: (participants: Participants[], selfIdRef: string) =>
    set((state) => ({
      participants: participants.map((p) => {
        const existing = state.participants.find((x) => x.userId === p.userId);

        return {
          ...p,
          isLocal: p.socketId === selfIdRef,
          stream: existing?.stream,
        };
      }),
    })),

  updateParticipantStream: (userId: string, track: MediaStreamTrack) =>
    set((state) => ({
      participants: state.participants.map((p) => {
        if (p.userId !== userId) return p;

        // Use existing stream if possible
        let stream = p.stream;
        if (!stream) {
          stream = new MediaStream();
        }

        // Add track if not already added
        if (!stream.getTracks().some((t) => t.id === track.id)) {
          stream.addTrack(track);
        }

        return { ...p, stream };
      }),
    })),
}));

