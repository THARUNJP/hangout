import api from "../clientApi/clientApi";
import { lsGetItem } from "../lib/helper";
import type {
  CreateSessionResponse,
  ValidateSessionResponse,
} from "../types/types";

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

export const validateSession = async (
  code: string
): Promise<ValidateSessionResponse> => {
  const { data } = await api.get<ValidateSessionResponse>(
    `/api/session/${code}`
  );
  return data;
};
