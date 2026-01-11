import { useState } from "react";
import NamePromptModal from "../propt-modal";
import { isValidateSessionCode, lsGetItem, lsSetItem } from "../../lib/helper";
import { useNavigate } from "react-router-dom";
import { createSession, validateSession } from "../../service/session.service";
import { SiteLoader } from "../../lib/loader";
import { showHotToast } from "../../lib/toast";
import { v4 as uuidV4 } from "uuid";

function Dashboard() {
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [selectedSessionCode, setSelectedSessionCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // useBlockBrowserNavigation();
  const navigate = useNavigate();

  const handleJoinClick = async () => {
    try {
      setIsLoading(true);
      const valid = isValidateSessionCode(selectedSessionCode);

      if (!valid) {
        showHotToast("Invalid session code", "error");
        return;
      }

      const session = await validateSession(selectedSessionCode);

      if (!session.status) {
        showHotToast(session.message, "error");
        return;
      }

      const storedName = lsGetItem("name");
      lsSetItem("userId", uuidV4());
      if (storedName) {
        navigate(`/meet/${selectedSessionCode}`);
        showHotToast("You joined the session", "success");
      } else {
        setShowNamePrompt(true);
      }
    } catch (error: any) {
      console.error("Join session failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to join the session right now. Please try again.";

      showHotToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = (name: string) => {
    if (!selectedSessionCode) return;
    lsSetItem("name", name);
    setShowNamePrompt(false);
    navigate(`/meet/${selectedSessionCode}`);
  };

  const createNewMeeting = async () => {
    try {
      setIsLoading(true);
      const { message, data } = await createSession();
      const storedName = lsGetItem("name");
      if (storedName) {
        showHotToast(message, "success");
        navigate(`/meet/${data.session_code}`);
      } else {
        setSelectedSessionCode(data.session_code);
        setShowNamePrompt(true);
      }
    } catch (err: any) {
      console.error("Error creating meeting:", err);
      showHotToast(
        err?.response?.data?.message || err?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      <NamePromptModal
        open={showNamePrompt}
        onContinue={handleContinue}
        onClose={() => setShowNamePrompt(false)}
      />
      {isLoading && <SiteLoader />}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900">
            Video Calls and
          </h1>
          <h1 className="text-3xl font-semibold text-gray-900">
            meeting for everyone
          </h1>
        </div>

        {/* Create / Join Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Create */}
          <button
            onClick={() => createNewMeeting()}
            className="flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-md"
          >
            + New meeting
          </button>

          {/* Join */}
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setSelectedSessionCode(e?.target?.value)}
              value={selectedSessionCode}
              placeholder="Enter meeting code"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span></span>
            <button
              onClick={() => handleJoinClick()}
              className="bg-gray-900 text-white px-5 rounded-xl text-sm hover:bg-gray-800 transition cursor-pointer"
            >
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
