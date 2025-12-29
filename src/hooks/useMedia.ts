import { useEffect, useRef } from "react";
import { mediaSocket } from "../socket";
import { Device } from "mediasoup-client";
import type { Transport } from "mediasoup-client/types";
import { getUserDevice } from "../lib/helper";

export function useMedia(
  sessionCode: string,
  name: string,
  sessionReady: boolean
) {
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

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

    console.log(joinRes.producers,"///existing producer");
    
         mediaSocket.on("new-producer", ({ producerId, kind }) => {
            console.log(producerId, kind,"///new producer created");
          });

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

          mediaSocket.emit(
            "create-send-transport",
            async (transportRes: any) => {
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
              const stream = await getUserDevice();
              if (!stream || !sendTransportRef.current) return;
              const audioTrack = stream.getAudioTracks()[0];
              if (audioTrack)
                await sendTransportRef.current.produce({ track: audioTrack });
              const videoTrack = stream.getVideoTracks()[0];
              if (videoTrack)
                await sendTransportRef.current.produce({ track: videoTrack });
            }
          );

          mediaSocket.emit("create-recv-transport", (res: any) => {
            if (!res?.status) return;

            const { id, iceParameters, iceCandidates, dtlsParameters } = res;
            const recvTransport = device.createRecvTransport({
              id,
              iceParameters,
              iceCandidates,
              dtlsParameters,
            });
            recvTransportRef.current = recvTransport;

            // DTLS handshake
            recvTransport.on(
              "connect",
              ({ dtlsParameters }, callback, errback) => {
                mediaSocket.emit(
                  "connect-transport",
                  { dtlsParameters, transportType: "recv" },
                  (res: any) => {
                    res?.status
                      ? callback()
                      : errback(new Error("DTLS connect failed"));
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
