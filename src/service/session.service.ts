import api from "../clientApi/clientApi";
import { lsGetItem } from "../lib/helper";
import type { CreateSessionResponse } from "../types/types";

export const createSession = async (): Promise<CreateSessionResponse> => {
  const hostName = lsGetItem("name");
  const userId = lsGetItem("userId");
  const callType = "SFU"; // or dynamic

  if (!hostName || !userId) throw new Error("User info missing");

  const { data } = await api.post<CreateSessionResponse>(
    "/api/session/create",
    {
      hostName,
      callType,
      userId,
    }
  );

  return data;
};
