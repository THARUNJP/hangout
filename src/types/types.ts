import type { CallType } from "../lib/constant";

export type Participants = {
  userId: string;
  socketId: string; // userId (stable)
  name?: string; // optional for now

  // Media
  mediaId?: string;
  stream?: MediaStream; // combined audio + video (for <video>)
  videoTrack?: MediaStreamTrack;
  audioTrack?: MediaStreamTrack;

  // UI state
  videoEnabled?: boolean;
  audioEnabled?: boolean;
  isLocal: boolean;

  // Mediasoup references (later)
  videoProducerId?: string;
  audioProducerId?: string;
};
export type CallType = (typeof CallType)[keyof typeof CallType];

export interface ParticipantsState {
  participants: Participants[];
  setParticipants: (participants: Participants[]) => void;
  addParticipant: (participant: Participants) => void;
  removeParticipant: (userId: string) => void;
  updateParticipant: (participants: Participants[], selfIdRef: string) => void;
  updateParticipantStream: (userId: string, track: MediaStreamTrack) => void;
}

export interface SessionState {
  sessionReady: boolean;
  setSessionReady: (isReady: boolean) => void;
}

export interface StreamState {
  stream: MediaStream | null;
  micEnabled: boolean;
  cameraEnabled: boolean;

  setStream: (stream: MediaStream) => void;
  toggleMic: (enabled: boolean) => void;
  toggleCamera: (enabled: boolean) => void;
  stopStream: () => void;
}

export interface CreateSessionResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    session_code: string;
    call_type: string;
    max_participants: number;
    host_name: string;
    status: string;
    created_at: string;
  };
}

export type ValidateSessionResponse = {
  status: CreateSessionResponse["status"];
  message: CreateSessionResponse["message"];
  data: Pick<CreateSessionResponse["data"], "id">;
};
