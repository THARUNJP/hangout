import { useEffect, useRef } from "react";
import { mediaSocket } from "../socket";
import { Device } from "mediasoup-client";
import type { Transport } from "mediasoup-client/types";
import { getUserDevice, lsGetItem } from "../lib/helper";

export function useMedia(
  sessionCode: string,
  name: string,
  sessionReady: boolean,
  updateParticipantStream: (socketId: string, stream: MediaStream) => void
) {
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  useEffect(() => {
    if (!sessionCode || !name || !sessionReady) return;
    mediaSocket.connect();
    const onConnect = () => {
      console.log("media socket connected", mediaSocket.id);

      // Create Device only once
      if (!deviceRef.current) {
        deviceRef.current = new Device();
      }
      const device = deviceRef.current;
      const userId = lsGetItem("userId");
      if (!userId) return; // nav to dash later

      // Join media session
      mediaSocket.emit(
        "join-media",
        { sessionCode, userId },
        async (joinRes: any) => {
          if (!joinRes?.status) return;

          console.log(joinRes.producers, "///existing producers");

          // ---- Handle existing producers ----
          for (const producer of joinRes.producers) {
            await consumeProducer(
              producer.producerId,
              producer.kind,
              producer.socketId
            );
          }

          // ---- Listen for new producers ----
          mediaSocket.on(
            "new-producer",
            async ({ producerId, kind, socketId }) => {
              await consumeProducer(producerId, kind, socketId);
            }
          );

          // ---- Get router RTP capabilities ----
          mediaSocket.emit("get-rtp-capabilities", async (rtpRes: any) => {
            if (!rtpRes?.status) return;

            if (!device.loaded) {
              await device.load({ routerRtpCapabilities: rtpRes.data });
            }
            console.log("device loaded:", device.loaded);

            // ---- Create send transport ----
            mediaSocket.emit(
              "create-send-transport",
              async (transportRes: any) => {
                if (!transportRes?.status) return;

                const sendTransport = device.createSendTransport({
                  id: transportRes.id,
                  iceParameters: transportRes.iceParameters,
                  iceCandidates: transportRes.iceCandidates,
                  dtlsParameters: transportRes.dtlsParameters,
                });
                sendTransportRef.current = sendTransport;

                // DTLS handshake
                sendTransport.on(
                  "connect",
                  ({ dtlsParameters }, callback, errback) => {
                    mediaSocket.emit(
                      "connect-transport",
                      { dtlsParameters, transportType: "send" },
                      (res: any) =>
                        res?.status
                          ? callback()
                          : errback(new Error("DTLS failed"))
                    );
                  }
                );

                // Producer signaling
                sendTransport.on(
                  "produce",
                  ({ kind, rtpParameters }, callback, errback) => {
                    mediaSocket.emit(
                      "produce",
                      { transportId: sendTransport.id, kind, rtpParameters },
                      (res: any) =>
                        res?.id
                          ? callback({ id: res.id })
                          : errback(new Error("Produce failed"))
                    );
                  }
                );

                // Get local media and produce tracks
                const stream = await getUserDevice();
                if (!stream) return;
                const audioTrack = stream.getAudioTracks()[0];
                if (audioTrack)
                  await sendTransport.produce({ track: audioTrack });
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack)
                  await sendTransport.produce({ track: videoTrack });
              }
            );

            // ---- Create recv transport ----
            mediaSocket.emit("create-recv-transport", (res: any) => {
              if (!res?.status) return;

              const recvTransport = device.createRecvTransport({
                id: res.id,
                iceParameters: res.iceParameters,
                iceCandidates: res.iceCandidates,
                dtlsParameters: res.dtlsParameters,
              });
              recvTransportRef.current = recvTransport;

              recvTransport.on(
                "connect",
                ({ dtlsParameters }, callback, errback) => {
                  mediaSocket.emit(
                    "connect-transport",
                    { dtlsParameters, transportType: "recv" },
                    (res: any) =>
                      res?.status
                        ? callback()
                        : errback(new Error("DTLS failed"))
                  );
                }
              );
            });
          });
        }
      );
    };

    // --- Helper to consume a producer ---
    async function consumeProducer(
      producerId: string,
      _kind: string,
      socketId: string
    ) {
      if (!deviceRef.current || !recvTransportRef.current) return;
      const device = deviceRef.current;
      const recvTransport = recvTransportRef.current;

      mediaSocket.emit(
        "consume",
        { producerId, rtpCapabilities: device.rtpCapabilities },
        async (consumerRes: any) => {
          if (!consumerRes?.status) return;

          console.log("Consumer created:", consumerRes);

          // Resume consumer
          await mediaSocket.emit("resume-consumer", {
            consumerId: consumerRes.id,
          });

          // Attach track to media element
          const consumer = await recvTransport.consume({
            id: consumerRes.id,
            producerId: consumerRes.producerId,
            kind: consumerRes.kind,
            rtpParameters: consumerRes.rtpParameters,
          });

          const mediaStream = new MediaStream();
          mediaStream.addTrack(consumer.track);

          // const el = document.createElement(
          //   consumer.kind === "video" ? "video" : "audio"
          // );
          // el.srcObject = mediaStream;
          // el.autoplay = true;
          // document.body.appendChild(el); // attach to UI as needed
        }
      );
    }

    mediaSocket.on("connect", onConnect);

    return () => {
      mediaSocket.off("connect", onConnect);
      if (mediaSocket.connected) {
        mediaSocket.disconnect();
      }
    };
  }, [sessionCode, name, sessionReady]);
}
