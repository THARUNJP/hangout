import api from "../clientApi/clientApi";
import { lsGetItem } from "../lib/helper";

export const createSession = async () => {
  const hostName = lsGetItem("name");
  const userId = lsGetItem("userId");
  const callType = "SFU";
  const data = { hostName, callType, userId };
  const response = api.post("/api/session/create", data);
  return response;
};
