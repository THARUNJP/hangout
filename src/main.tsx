import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import Dashboard from "./components/dashboard";
import Meet from "./components/meet";
import { MeetingGuard } from "./components/meet/components/meetingGuard";
import { meetingLoader } from "./components/meet/components/meetingLoader";
import "./index.css";
import MeetingError from "./components/meet/components/meetingError";
import GlobalError from "./lib/globalError";

const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <GlobalError />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/meet/:code",
        loader: meetingLoader,
        element: <MeetingGuard />,
        errorElement: <MeetingError />,
        children: [
          {
            index: true,
            element: <Meet />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
    <Toaster position="top-right" />
  </>
);
