import { Link } from "react-router-dom";
import { sessions } from "../../lib/constant";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Realtime Session Lobby
          </h1>
          <p className="text-sm text-gray-500">
            Create a session or join an existing one
          </p>
        </div>

        {/* Create Session */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter session code"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
            Create
          </button>
        </div>

        {/* Sessions List */}
        <div className="space-y-3">
          <h2 className="text-lg font-medium text-gray-700">Active Sessions</h2>

          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500">No active sessions</p>
          ) : (
            sessions.map((session) => (
              <Link
                key={session.sessionCode}
                className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3"
                to={`meet/${session.sessionCode}`}
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {session.sessionCode}
                  </p>
                  <p className="text-sm text-gray-500">
                    Participants: {session.participants}
                  </p>
                </div>
                <button className="bg-green-600 text-white px-4 py-1.5 rounded-md hover:bg-green-700 transition">
                  Join
                </button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
