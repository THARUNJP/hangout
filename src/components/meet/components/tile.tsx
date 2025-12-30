import { useEffect, useRef } from "react";
import type { Participants } from "../../../types/types";

export function ParticipantTile({
  participant,
}: {
  participant: Participants;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && participant.stream) {
      videoRef.current.srcObject = participant.stream;
    }
  }, [participant.stream]);

  return (
    <div className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white relative">
      {participant.stream ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted={participant.isLocal}
        />
      ) : (
        <span>{participant.name}</span>
      )}
    </div>
  );
}
