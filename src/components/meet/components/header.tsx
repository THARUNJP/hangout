export default function MeetHeader() {
  return (
    <header className="w-full h-14 px-6 flex items-center justify-between bg-white border-b border-gray-200">
      
      {/* Left: Meeting Info */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-800">
          Team Sync Meeting
        </span>
        <span className="text-xs text-gray-500">
          Session: abc-defg-hij
        </span>
      </div>

      {/* Center: Connection Status */}
      <div className="text-sm text-green-600 font-medium">
        Connected
      </div>

      {/* Right: Participants */}
      <div className="text-sm text-gray-600">
        Participants: <span className="font-medium">3 / 10</span>
      </div>

    </header>
  );
}
