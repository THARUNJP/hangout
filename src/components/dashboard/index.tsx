import { sessions } from "../../lib/constant";
import { useState } from "react";
import NamePromptModal from "../propt-modal";
import { isValidateSessionCode, lsGetItem, lsSetItem } from "../../lib/helper";
import { useNavigate } from "react-router-dom";
import { createSession } from "../../service/session.service";
import { SiteLoader } from "../../lib/loader";
import { showHotToast } from "../../lib/toast";
// import { useBlockBrowserNavigation } from "../../hooks/useNavigationBlock";

function Dashboard() {
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [selectedSessionCode, setSelectedSessionCode] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  // useBlockBrowserNavigation();
  const navigate = useNavigate();

  const handleJoinClick = (sessionCode: string) => {
    const valid = isValidateSessionCode(sessionCode);
    if (!valid) {
      showHotToast("Invalid session code", "error");
      return;
    }
    // need to do api call for check it is registered session code
    const storedName = lsGetItem("name");
    setSelectedSessionCode(sessionCode);

    if (storedName) {
      navigate(`/meet/${sessionCode}`);
      showHotToast("You joined the session", "success");
    } else {
      setShowNamePrompt(true);
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
      showHotToast(message, "success");
      navigate(`/meet/${data.session_code}`);
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
            onClick={async () => await createNewMeeting()}
            className="flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-md"
          >
            + New meeting
          </button>

          {/* Join */}
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setInput(e?.target?.value)}
              value={input}
              placeholder="Enter meeting code"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span></span>
            <button
              onClick={() => handleJoinClick(input)}
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
