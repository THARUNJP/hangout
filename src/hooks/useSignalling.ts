import { useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import {
  createSession,
  joinSession,
  leaveSession,
} from "../socket/session.socket";
import { CallType } from "../lib/constant";
import type { Participants } from "../types/types";
import { lsGetItem } from "../lib/helper";

export function useMeetingSocket(sessionCode: string, name: string) {
  const [participants, setParticipants] = useState<Participants[]>([]);
  const [sessionReady, setSessionReady] = useState(false);
  const selfIdRef = useRef<string | null>(null);

  const updateParticipantStream = (userId: string, track: MediaStreamTrack) => {
    console.log("update call",track);
    
    setParticipants((prev) =>
      prev.map((p) => {
        if (p.userId !== userId) return p;

        // Reuse existing stream or create a new one
        const stream = p.stream ?? new MediaStream();

        // Avoid duplicate tracks
        if (!stream.getTracks().some((t) => t.id === track.id)) {
          stream.addTrack(track);
        }

        return { ...p, stream };
      })
    );
  };
  useEffect(() => {
    if (!sessionCode || !name) return;

    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("signaling socket connected", socket.id);
      if (socket?.id) selfIdRef.current = socket.id;
      const userId = lsGetItem("userId");
      createSession(sessionCode, CallType.SFU);
      joinSession(sessionCode, name);
      if (!userId) return; // nav to dash
      setParticipants([
        {
          userId: userId,
          socketId: socket.id!,
          name,
          isLocal: true,
        },
      ]);
      setSessionReady(true);
    };

    const onParticipantsUpdated = ({
      participants: incoming,
    }: {
      participants: Participants[];
    }) => {
      setParticipants((prev) =>
        incoming.map((p) => {
          const existing = prev.find((x) => x.userId === p.userId);

          return {
            ...p,
            isLocal: p.socketId === selfIdRef.current,
            stream: existing?.stream,
          };
        })
      );
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

  return { participants, sessionReady, updateParticipantStream };
}
