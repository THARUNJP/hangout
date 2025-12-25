import { socket } from ".";
import type { CallType } from "../types/types";

export function createSession(sessionCode: string, callType: CallType) {
  socket.emit("create-session", { sessionCode, callType });
}

export function joinSession(sessionCode: string, username: string) {
    console.log("....calls");
  socket.emit("join-session", { sessionCode, username });
}

export function leaveSession(sessionCode: string) {
  socket.emit("leave-session", { sessionCode });
}

socket.on("participants-updated", ({ participants, message }) => {
  console.log("....participants updated .....here", participants, message);
});
