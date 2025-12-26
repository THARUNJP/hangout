import { useEffect, useState } from "react";
import { mediaSocket, socket } from "../socket";
import {
  createSession,
  joinSession,
  leaveSession,
} from "../socket/session.socket";
import { CallType } from "../lib/constant";

export function useMeetingSocket(sessionCode: string, name: string) {
  const [participants, setParticipants] = useState<any[]>([]);

  useEffect(() => {
    if (!sessionCode || !name) return;

    if (!socket.connected) {
      socket.connect();
    }
    if (!mediaSocket.connected) {
      mediaSocket.connect();
    }
    
    const handleConnect = () => {
      console.log("signaling socket connected");
    };

    const handleParticipantsUpdated = ({
      participants,
      message,
    }: {
      participants: any[];
      message: string;
    }) => {
      console.log("participants updated", participants);
      setParticipants(participants);
    };

    socket.on("connect", handleConnect);
    socket.on("participants-updated", handleParticipantsUpdated);

  
    createSession(sessionCode, CallType.SFU);
    joinSession(sessionCode, name);

    
    return () => {
      // tell server first
      leaveSession(sessionCode);

      // remove listeners
      socket.off("connect", handleConnect);
      socket.off("participants-updated", handleParticipantsUpdated);

      // disconnect sockets
      if (socket.connected) {
        socket.disconnect();
      }

      if (mediaSocket.connected) {
        mediaSocket.disconnect();
      }
      console.log("sockets disconnected");
    };
  }, [sessionCode, name]);

  return {
    participants,
  };
}
