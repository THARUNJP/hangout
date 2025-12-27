import { useEffect, useRef } from "react";
import { mediaSocket } from "../socket";
import { Device } from "mediasoup-client";

export function useMedia(sessionCode: string, name: string,sessionReady: boolean) {
  const deviceRef = useRef<Device | null>(null);
  useEffect(() => {
    if (!sessionCode || !name || !sessionReady) return;
    mediaSocket.connect();
    const onConnect = () => {
      console.log("media socket connected", mediaSocket.id);

      // Create device once
      if (!deviceRef.current) {
        deviceRef.current = new Device();
      }

      mediaSocket.emit("join-media", { sessionCode }, (res: any) => {
        if (!res?.status) return;

        mediaSocket.emit("get-rtp-capabilities", async (res: any) => {
          const { status, data, message } = res;
          if (!status) return;

          const device = deviceRef.current;
          if (!device) return;

          if (!device.loaded) {
            await device.load({
              routerRtpCapabilities: data,
            });
          }

          console.log("device loaded", device.loaded, message);
        });
      });
 
      mediaSocket.emit("create-send-transport",(res:any)=>{
        console.log(res,"recieved server res from create send");
        
      })




    };
    mediaSocket.on("connect", onConnect);

    return () => {
      mediaSocket.off("connect", onConnect);
    };
  }, [sessionCode, name,sessionReady]);
}
