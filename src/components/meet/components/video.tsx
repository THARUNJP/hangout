import { useEffect, useRef, useState } from "react";
import { getGridClass, getUserDevice, lsGetItem } from "../../../lib/helper";
import { useNavigate, useParams } from "react-router-dom";
import { useMeetingSocket } from "../../../hooks/useSignalling";
import { useMedia } from "../../../hooks/useMedia";

export default function VideoGrid() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const name: string = lsGetItem("name") || "unknown";
  // aslo later need to check the sessioncode is valid and navigate if not
  useEffect(() => {
    if (!code) navigate("/");
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
  const { participants, sessionReady } = useMeetingSocket(code || "", name);
  useMedia(code || "", name, sessionReady);

  console.log(participants, "?");

  // Mock participants (UI only)
  // const participants: Participant[] = Array.from({ length: 5 }, (_, i) => ({
  //   id: String(i),
  //   name: `User ${i + 1}`,
  // }));

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
              <span>{p.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
