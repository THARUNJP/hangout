import { sessions } from "../../lib/constant";
import { useState } from "react";
import NamePromptModal from "../propt-modal";
import { lsGetItem, lsSetItem } from "../../lib/helper";
import { useNavigate } from "react-router-dom";
import { SiteLoader } from "../loader";
import { createSession } from "../../service/session.service";
// import { useBlockBrowserNavigation } from "../../hooks/useNavigationBlock";

function Dashboard() {
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [selectedSessionCode, setSelectedSessionCode] = useState<string | null>(
    null
  );
  const [isLoading, setIsloading] = useState<boolean>(false);

  // useBlockBrowserNavigation();
  const navigate = useNavigate();

  const handleJoinClick = (sessionCode: string) => {
    const storedName = lsGetItem("name");

    setSelectedSessionCode(sessionCode);

    if (storedName) {
      navigate(`/meet/${sessionCode}`);
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
      setIsloading(true);
      const response = await createSession();
      console.log(response);
    } catch (err) {
      console.log("err in create new meeting", err);
    } finally {
      setIsloading(false);
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
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-md"
          >
            + New meeting
          </button>

          {/* Join */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter meeting code"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-gray-900 text-white px-5 rounded-xl text-sm hover:bg-gray-800 transition">
              Join
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">ACTIVE SESSIONS</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              No active sessions right now
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.sessionCode}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-5 py-4 hover:shadow-md transition bg-white"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {session.sessionCode}
                  </p>
                  <p className="text-xs text-gray-500">
                    {session.participants} participants
                  </p>
                </div>

                <button
                  onClick={() => handleJoinClick(session.sessionCode)}
                  className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                >
                  Join
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
