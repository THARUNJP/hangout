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

    const onConnect = () => {
      console.log("signaling socket connected");
    };

    const onMediaConnect = () => {
      console.log("media socket connected");
    };

    const onParticipantsUpdated = ({
      participants,
      message,
    }: {
      participants: any[];
      message: string;
    }) => {
      console.log("participants update", participants);
      setParticipants(participants);
    };

    socket.on("connect", onConnect);
    mediaSocket.on("connect", onMediaConnect);
    socket.on("participants-updated", onParticipantsUpdated);

    createSession(sessionCode, CallType.SFU);
    joinSession(sessionCode, name);

    return () => {
      // IMPORTANT: tell server first
      leaveSession(sessionCode);

      // remove listeners
      socket.off("connect", onConnect);
      socket.off("participants-updated", onParticipantsUpdated);
      mediaSocket.off("connect", onMediaConnect);

      // disconnect both sockets
      if (socket.connected) socket.disconnect();
      if (mediaSocket.connected) mediaSocket.disconnect();

      console.log("all sockets disconnected");
    };
  }, [sessionCode, name]);

  return { participants };
}
