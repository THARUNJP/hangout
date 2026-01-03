import type { JSX } from "react";
import { Navigate, useParams } from "react-router-dom";

export function MeetingGuard({ children }: { children: JSX.Element }) {
  const { code } = useParams<{ code: string }>();

  if (!code) {
    return <Navigate to="/" replace />; // replace the current history entry user cant push back 
  }
  // aslo later need to check the sessioncode is valid and navigate if not

  return children;
}
