import { Camera, CameraOff, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStreamStore } from "../../../store";
import { confirmAction } from "../../../lib/helper";
import { LeaveMeetingMessage } from "../../../lib/constant";

export default function MeetFooter() {
  const toggleMic = useStreamStore((state) => state.toggleMic);
  const toggleCamera = useStreamStore((state) => state.toggleCamera);
  const micEnabled: boolean = useStreamStore((state) => state.micEnabled);
  const cameraEnabled: boolean = useStreamStore((state) => state.cameraEnabled);
  const navigate = useNavigate();

  const handleLeave = async () => {
    const confirmed = await confirmAction(LeaveMeetingMessage);
    if (confirmed) {
      navigate("/");
    }
  };

  return (
    <footer className="w-full h-16 bg-white border-t border-gray-200 flex items-center justify-center">
      <div className="flex items-center gap-6">
        {/* Mic */}
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => toggleMic(!micEnabled)}
        >
          {micEnabled ? <Mic size={25} /> : <MicOff />}
        </button>

        {/* Camera */}
        <button
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
          onClick={() => toggleCamera(!cameraEnabled)}
        >
          {cameraEnabled ? <Camera size={25} /> : <CameraOff size={25} />}
        </button>

        {/* Leave */}
        <div
          onClick={() => handleLeave()}
          className="px-6 cursor-pointer py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Leave
        </div>

        {/* More */}
        <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          More
        </button>
      </div>
    </footer>
  );
}
