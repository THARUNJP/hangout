import { useEffect, useRef, useState } from "react";
import { getGridClass, getUserDevice } from "../../../lib/helper";
import type { Participant } from "../../../types/types";

export default function VideoGrid() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

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

  // Mock participants (UI only)
  const participants: Participant[] = Array.from({ length: 5 }, (_, i) => ({
    id: String(i),
    name: `User ${i + 1}`,
  }));

  return (
    <div className="flex-1 p-4 h-[calc(100vh-(4rem+3.5rem))]">
      <div
        className={`
          grid gap-4 h-full
          ${getGridClass(participants.length)}
          place-items-center
        `}
      >
        {participants.map((p, index) => (
          <div
            key={p.id}
            className="w-full h-full bg-black rounded-lg flex items-center justify-center text-white"
          >
            {index === 0 ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
              />
            ) : (
              <span>{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
