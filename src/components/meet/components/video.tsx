import { useEffect, useRef, useState } from "react";
import { getGridClass, getUserDevice, lsGetItem } from "../../../lib/helper";
import { Navigate, useParams } from "react-router-dom";
import { useMeetingSocket } from "../../../hooks/useSignalling";
import { useMedia } from "../../../hooks/useMedia";
import { ParticipantTile } from "./tile";
import { useParticipantsStore } from "../../../store";
import { UseSessionStore } from "../../../store/session.store";

export default function VideoGrid() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { code } = useParams<{ code: string }>();
  const name: string = lsGetItem("name") || "unknown";
  const participants = useParticipantsStore((state) => state.participants);
  const sessionReady = UseSessionStore((state) => state.sessionReady);


  useEffect(() => {
    async function fetchUserMedia() {
      const stream = await getUserDevice();
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStream(stream);
      }
    }
    fetchUserMedia();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  useMeetingSocket(code!, name);
  useMedia(code!, name, sessionReady);

  return (
    <div className="flex-1 p-4 h-[calc(100vh-(4rem+3.5rem))]">
      <div
        className={`
          grid gap-4 h-full
          ${getGridClass(participants.length)}
          place-items-center
        `}
      >
        {participants.map((p, _index) => (
          <div
            key={p.socketId}
            className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white"
          >
            {p?.isLocal ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <ParticipantTile key={p.socketId} participant={p} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
