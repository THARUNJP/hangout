import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import {
  createSession,
  joinSession,
  leaveSession,
} from "../socket/session.socket";
import { CallType } from "../lib/constant";
import type { Participants } from "../types/types";

export function useMeetingSocket(sessionCode: string, name: string) {
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [sessionReady, setSessionReady] = useState(false);
  const selfIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!sessionCode || !name) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("signaling socket connected", socket.id);
      if (socket?.id) selfIdRef.current = socket.id;
      setParticipants([
        {
          socketId: socket.id!,
          name,
          isLocal: true,
        },
      ]);
      createSession(sessionCode, CallType.SFU);
      joinSession(sessionCode, name);
      setSessionReady(true);
    };

    const onParticipantsUpdated = ({
      participants,
      message,
    }: {
      participants: Participants[];
      message: string;
    }) => {
      console.log("participants update", participants);
      const modifiedParticipants = participants.map((e) => {
        if (e.socketId === selfIdRef.current) {
          return { ...e, isLocal: true };
        } else {
          return e;
        }
      });
      setParticipants(modifiedParticipants);
    };

    socket.on("connect", onConnect);
    socket.on("participants-updated", onParticipantsUpdated);

    return () => {
      // IMPORTANT: tell server first
      leaveSession(sessionCode);
      setSessionReady(false);
      // remove listeners
      socket.off("connect", onConnect);
      socket.off("participants-updated", onParticipantsUpdated);

      // disconnect both sockets
      if (socket.connected) socket.disconnect();

      console.log("all sockets disconnected");
    };
  }, [sessionCode, name]);

  return { participants, sessionReady };
}
