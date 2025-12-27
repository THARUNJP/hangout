import { useEffect } from "react";
import { mediaSocket } from "../socket";

export function useMedia(sessionCode: string, name: string) {
  useEffect(() => {
    if (!sessionCode || !name) return;
    mediaSocket.connect();

    mediaSocket.on("connect", onConnect);

    return () => {
      mediaSocket.off("connect", onConnect);
    };
  }, [sessionCode, name]);
}
const onConnect = () => {
  console.log("media socket connected", mediaSocket.id);
};
