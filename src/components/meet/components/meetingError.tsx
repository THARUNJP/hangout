import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { showHotToast } from "../../../lib/toast";
import { useEffect } from "react";

export default function MeetingError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = "Something went wrong";

  if (isRouteErrorResponse(error)) {
    message = error?.data;
  }

  useEffect(() => {
    showHotToast(message, "error");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Unable to join meeting
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Go back home
        </button>
      </div>
    </div>
  );
}
