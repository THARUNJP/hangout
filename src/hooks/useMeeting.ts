import { useEffect } from "react";
import { socket } from "../socket";
import { joinSession, leaveSession } from "../socket/session.socket";

export function useMeetingSocket(sessionCode: string, name: string) {
  useEffect(() => {
    if (!sessionCode) return;
    socket.connect();
    console.log("socket connected to server");
    
    joinSession(sessionCode, name);
    return () => {
      
      if (socket.connected) {
        leaveSession(sessionCode);
        socket.disconnect();
        console.log("socket disconnected to server");
      }
    };
  }, [sessionCode]);
}
