import { useEffect, useRef } from "react";
import { mediaSocket } from "../socket";
import { Device } from "mediasoup-client";
import type { Transport } from "mediasoup-client/types";

export function useMedia(
  sessionCode: string,
  name: string,
  sessionReady: boolean
) {
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);

  useEffect(() => {
    if (!sessionCode || !name || !sessionReady) return;
    mediaSocket.connect();
    const onConnect = () => {
      console.log("media socket connected", mediaSocket.id);

      //Create Device ONLY ONCE
      if (!deviceRef.current) {
        deviceRef.current = new Device();
      }

      // Join media session FIRST
      mediaSocket.emit("join-media", { sessionCode }, (joinRes: any) => {
        if (!joinRes?.status) return;

        mediaSocket.emit("get-rtp-capabilities", async (rtpRes: any) => {
          if (!rtpRes?.status) return;

          const device = deviceRef.current;
          if (!device) return;

          if (!device.loaded) {
            await device.load({
              routerRtpCapabilities: rtpRes.data,
            });
          }

          console.log("device loaded:", device.loaded);

          mediaSocket.emit("create-send-transport", (transportRes: any) => {
            if (!transportRes?.status) return;

            const { id, iceParameters, iceCandidates, dtlsParameters } =
              transportRes;

            // Create Send Transport SAFELY
            const sendTransport = device.createSendTransport({
              id,
              iceParameters,
              iceCandidates,
              dtlsParameters,
            });

            sendTransportRef.current = sendTransport;

            // DTLS handshake
            sendTransport.on(
              "connect",
              ({ dtlsParameters }, callback, errback) => {
                mediaSocket.emit(
                  "connect-transport",
                  {
                    dtlsParameters,
                    transportType: "send",
                  },
                  (serverRes: any) => {
                    serverRes?.status
                      ? callback()
                      : errback(new Error("DTLS connect failed"));
                  }
                );
              }
            );

            // Producer signaling
            sendTransport.on(
              "produce",
              ({ kind, rtpParameters }, callback, errback) => {
                mediaSocket.emit(
                  "produce",
                  {
                    transportId: sendTransport.id,
                    kind,
                    rtpParameters,
                  },
                  (res: any) => {
                    res?.id
                      ? callback({ id: res.id })
                      : errback(new Error("Produce failed"));
                  }
                );
              }
            );
          });
        });
      });
    };

    mediaSocket.on("connect", onConnect);

    return () => {
      mediaSocket.off("connect", onConnect);
      if (mediaSocket.connected) {
        mediaSocket.disconnect();
      }
    };
  }, [sessionCode, name, sessionReady]);
}
