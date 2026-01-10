import type { JSX } from "react";
import { Navigate, useParams } from "react-router-dom";
import { validateSession } from "../../../service/session.service";
import { showHotToast } from "../../../lib/toast";

export async function MeetingGuard({ children }: { children: JSX.Element }) {
  const { code } = useParams<{ code: string }>();
  if (!code) {
    return <Navigate to="/" replace />; // replace the current history entry user cant push back 
  }
  const session = await validateSession(code);// session is valid check

  if(!session.status){
    showHotToast(session.message,"error")
    return <Navigate to="/" replace />;
  }

  return children;
}
