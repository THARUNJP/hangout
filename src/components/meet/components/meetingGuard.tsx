import { Outlet, Navigate, useLoaderData } from "react-router-dom";
import type { ValidateSessionResponse } from "../../../types/types";

export function MeetingGuard() {
  const session = useLoaderData() as ValidateSessionResponse;

  if (!session.status) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
