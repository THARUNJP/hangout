import { socket } from ".";
import { lsGetItem } from "../lib/helper";
import type { CallType } from "../types/types";
import { v4 as uuidv4 } from "uuid";

export function createSession(sessionCode: string, callType: CallType) {
  socket.emit("create-session", { sessionCode, callType });
}

export function joinSession(sessionCode: string, participantName: string) {
  const userId = lsGetItem("userId") || uuidv4()
  socket.emit("join-session", { sessionCode, participantName, userId });
}

export function leaveSession(sessionCode: string) {
  socket.emit("leave-session", { sessionCode });
}

// socket.on("participants-updated", ({ participants, message }) => {
//   console.log("....participants updated .....here", participants, message);
// });
