import api from "../clientApi/clientApi";
import { lsGetItem } from "../lib/helper";

export const createSession = async () => {
  const hostName = lsGetItem("name");
  const callType = "SFU";
  const data = { hostName, callType };
  const response = api.post("/api/session/create", data);
  return response;
};
