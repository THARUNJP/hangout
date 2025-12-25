import { Link } from "react-router-dom";

export default function MeetFooter() {
  return (
    <footer className="w-full h-16 bg-white border-t border-gray-200 flex items-center justify-center">
      <div className="flex items-center gap-6">
        {/* Mic */}
        <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          Mic
        </button>

        {/* Camera */}
        <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          Camera
        </button>

        {/* Leave */}
        <Link
          to={"/"}
          className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
        >
          Leave
        </Link>

        {/* More */}
        <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition">
          More
        </button>
      </div>
    </footer>
  );
}
