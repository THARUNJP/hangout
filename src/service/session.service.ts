import api from "../clientApi/clientApi";
import { lsGetItem, lsSetItem } from "../lib/helper";
import { v4 as uuidv4 } from "uuid";
import type {
  CreateSessionResponse,
  ValidateSessionResponse,
} from "../types/types";

export const createSession = async (): Promise<CreateSessionResponse> => {
  let userId = lsGetItem("userId");
  if (!userId) {
    userId = uuidv4();
    lsSetItem("userId", userId);
  }
  const callType = "SFU"; // or dynamic
  if (!userId) throw new Error("User info missing");

  const { data } = await api.post<CreateSessionResponse>(
    "/api/session/create",
    {
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
