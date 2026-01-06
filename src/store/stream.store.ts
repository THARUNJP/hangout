import { create } from "zustand";
import type { StreamState } from "../types/types";

export const useStreamStore = create<StreamState>((set, get) => ({
  stream: null,
  micEnabled: true,
  cameraEnabled: true,

  setStream: (stream) => {
    set({ stream });
  },

  toggleMic: (enabled) => {
    const stream = get().stream;
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });

    set({ micEnabled: enabled });
  },

  toggleCamera: (enabled) => {
    const stream = get().stream;
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });

    set({ cameraEnabled: enabled });
  },

  stopStream: () => {
    const stream = get().stream;
    stream?.getTracks().forEach((track) => track.stop());

    set({
      stream: null,
      micEnabled: true,
      cameraEnabled: true,
    });
  },
}));
