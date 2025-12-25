import { useEffect } from "react";
import { socket } from "../socket";
import { createSession, joinSession, leaveSession } from "../socket/session.socket";
import { CallType } from "../lib/constant";

export function useMeetingSocket(sessionCode: string, name: string) {
  useEffect(() => {
    if (!sessionCode) return;
    socket.connect();

    socket.on("connect",()=>{
       console.log("socket connected to server");
    })

    socket.on("participants-updated", (data) => {
    console.log("participants update", data);
  });
    createSession(sessionCode,CallType.SFU)
    joinSession(sessionCode, name);
    return () => {
       socket.off("participants-updated");
      if (socket.connected) {
        leaveSession(sessionCode);
        socket.disconnect();
        console.log("socket disconnected to server");
      }
    };
  }, [sessionCode]);
}
