import { socket } from ".";
import type { CallType } from "../types/types";

export function createSession(sessionCode:string,callType:CallType) {
  socket.emit("create-session", { sessionCode,callType });
}

export function joinSession(sessionCode: string, username: string) {
  socket.emit("join-session", { sessionCode, username });
}

export function leaveSession(sessionCode: string) {
  socket.emit("leave-session", { sessionCode });
}
