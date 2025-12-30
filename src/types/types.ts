import type { CallType } from "../lib/constant";

export type Participant = {
  id: string;
  name: string;
};

export type Participants = {
  userId:string;
  socketId: string;                 // userId (stable)
  name?: string;              // optional for now

  // Media
  mediaId?:string;
  stream?: MediaStream;       // combined audio + video (for <video>)
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
export type CallType =(typeof CallType)[keyof typeof CallType];