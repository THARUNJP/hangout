import { useEffect } from "react";
import { socket } from "../socket";
import { joinSession, leaveSession } from "../socket/session.socket";

export function useMeetingSocket(sessionCode: string, name: string) {
  useEffect(() => {
    if (!sessionCode) return;
    socket.connect();
    joinSession(sessionCode, name);
    return () => {
      leaveSession(sessionCode);
      socket.disconnect();
    };
  }, [sessionCode]);
}
