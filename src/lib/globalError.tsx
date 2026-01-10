import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import NotFound from "../components/404";

export default function GlobalError() {
  const error = useRouteError();

  // Router thrown errors (404, 401, 410, etc)
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
        <h1 className="text-4xl font-bold text-gray-900">
          {error.status}
        </h1>
        <p className="mt-3 text-gray-600 text-center">
          {error.data || "Something went wrong"}
        </p>

        <Link
          to="/"
          className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
        >
          Go Home
        </Link>
      </div>
    );
  }

  // JS crash (undefined.map, etc)
  const message =
    error instanceof Error ? error.message : "Unexpected error";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 px-6">
      <h1 className="text-3xl font-semibold text-red-600">
        Application Error
      </h1>

      <p className="mt-4 max-w-md text-center text-gray-700">
        {message}
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-black"
      >
        Back to Home
      </Link>
    </div>
  );
}
