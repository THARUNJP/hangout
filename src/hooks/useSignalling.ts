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
import { useParticipantsStore } from "../store";
import { UseSessionStore } from "../store/session.store";

export function useMeetingSocket(sessionCode: string, name: string) {
  const setParticipants = useParticipantsStore((s) => s.setParticipants);
  const updateParticipant = useParticipantsStore((s) => s.updateParticipant);
  const setSessionReady = UseSessionStore((state) => state.setSessionReady);

  const selfIdRef = useRef<string | null>(null);

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
      const intialData = {
        userId: userId,
        socketId: socket.id!,
        name,
        isLocal: true,
      };
      setParticipants([intialData]);
      setSessionReady(true);
    };

    const onParticipantsUpdated = ({
      participants: incoming,
    }: {
      participants: Participants[];
    }) => {
      if (selfIdRef.current) updateParticipant(incoming, selfIdRef.current);
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
}
