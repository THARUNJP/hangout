import { useEffect, useRef } from "react";
import { mediaSocket } from "../socket";
import { Device } from "mediasoup-client";
import type { Transport } from "mediasoup-client/types";
import { lsGetItem } from "../lib/helper";
import {
  useParticipantsStore,
  UseSessionStore,
  useStreamStore,
} from "../store";

// export function useMedia(sessionCode: string, name: string) {
//   const deviceRef = useRef<Device | null>(null);
//   const sendTransportRef = useRef<Transport | null>(null);
//   const recvTransportRef = useRef<Transport | null>(null);
//   const updateParticipantStream = useParticipantsStore(
//     (state) => state.updateParticipantStream
//   );
//   const sessionReady = UseSessionStore((state) => state.sessionReady);

//   const pendingProducersRef = useRef<
//     { producerId: string; kind: string; userId: string }[]
//   >([]);

//   useEffect(() => {
//     if (!sessionCode || !name || !sessionReady) return;
//     mediaSocket.connect();
//     const onConnect = () => {
//       if (!deviceRef.current) {
//         deviceRef.current = new Device();
//       }

//       const device = deviceRef.current;
//       const userId = lsGetItem("userId");
//       if (!userId) return;

//       const tryConsumePending = async () => {
//         if (!recvTransportRef.current || !deviceRef.current) {
//           return;
//         }

//         if (pendingProducersRef.current.length === 0) {
//           return;
//         }

//         const list = [...pendingProducersRef.current];
//         pendingProducersRef.current = [];

//         for (const p of list) {
//           await consumeProducer(p.producerId, p.kind, p.userId);
//         }
//       };

//       // ---- Listen for new producers (BUFFER ONLY) ----
//       mediaSocket.on("new-producer", ({ producerId, kind, userId }) => {
//         pendingProducersRef.current.push({ producerId, kind, userId });
//         tryConsumePending();
//       });

//       // ---- Join media session ----
//       mediaSocket.emit(
//         "join-media",
//         { sessionCode, userId },
//         async (joinRes: any) => {
//           if (!joinRes?.status) return;

//           // ---- Get router RTP capabilities ----
//           mediaSocket.emit("get-rtp-capabilities", async (rtpRes: any) => {
//             if (!rtpRes?.status) return;

//             if (!device.loaded) {
//               await device.load({ routerRtpCapabilities: rtpRes.data });
//             }

//             // ---- Create send transport ----
//             if (!sendTransportRef.current) {
//               mediaSocket.emit(
//                 "create-send-transport",
//                 async (transportRes: any) => {
//                   if (!transportRes?.status) return;

//                   const sendTransport =
//                     device.createSendTransport(transportRes);
//                   sendTransportRef.current = sendTransport;

//                   sendTransport.on(
//                     "connect",
//                     ({ dtlsParameters }, callback, errback) => {
//                       mediaSocket.emit(
//                         "connect-transport",
//                         { dtlsParameters, transportType: "send" },
//                         (res: any) => {
//                           if (res?.status) {
//                             callback();
//                           } else {
//                             errback(new Error("DTLS failed"));
//                           }
//                         }
//                       );
//                     }
//                   );

//                   sendTransport.on(
//                     "produce",
//                     ({ kind, rtpParameters }, callback, errback) => {
//                       mediaSocket.emit(
//                         "produce",
//                         {
//                           transportId: sendTransport.id,
//                           kind,
//                           rtpParameters,
//                         },
//                         (res: any) =>
//                           res?.id
//                             ? callback({ id: res.id })
//                             : errback(new Error("Produce failed"))
//                       );
//                     }
//                   );

//                   let stream = useStreamStore.getState().stream;
//                   if (!stream) {
//                     // wait until stream is ready
//                     stream = await new Promise<MediaStream>((resolve) => {
//                       const unsub = useStreamStore.subscribe(
//                         (state) => state.stream,
//                         (s) => {
//                           if (s) {
//                             unsub(); // stop listening
//                             resolve(s);
//                           }
//                         }
//                       );
//                     });
//                   }

//                   const audioTrack = stream.getAudioTracks()[0];
//                   if (audioTrack)
//                     await sendTransport.produce({ track: audioTrack });

//                   const videoTrack = stream.getVideoTracks()[0];
//                   if (videoTrack)
//                     await sendTransport.produce({ track: videoTrack });
//                 }
//               );
//             }

//             // ---- Create recv transport ----
//             if (!recvTransportRef.current) {
//               mediaSocket.emit("create-recv-transport", async (res: any) => {
//                 if (!res?.status) return;

//                 const recvTransport = device.createRecvTransport(res);
//                 recvTransportRef.current = recvTransport;

//                 recvTransport.on(
//                   "connect",
//                   ({ dtlsParameters }, callback, errback) => {
//                     mediaSocket.emit(
//                       "connect-transport",
//                       { dtlsParameters, transportType: "recv" },
//                       (res: any) => {
//                         if (res?.status) {
//                           callback();
//                           tryConsumePending();
//                         } else {
//                           errback(new Error("DTLS failed"));
//                         }
//                       }
//                     );
//                   }
//                 );

//                 // ---- Buffer existing producers ----
//                 if (joinRes?.producers?.length) {
//                   pendingProducersRef.current.push(...joinRes.producers);
//                 }

//                 tryConsumePending();
//               });
//             }
//           });
//         }
//       );
//     };

//     // --- Helper to consume a producer ---
//     async function consumeProducer(
//       producerId: string,
//       _kind: string,
//       userId: string
//     ) {
//       if (!deviceRef.current || !recvTransportRef.current) {
//         return;
//       }
//       const device = deviceRef.current;
//       const recvTransport = recvTransportRef.current;

//       mediaSocket.emit(
//         "consume",
//         { producerId, rtpCapabilities: device.rtpCapabilities },
//         async (consumerRes: any) => {
//           if (!consumerRes?.status) return;

//           // Create consumer (still paused on server)
//           const consumer = await recvTransport.consume({
//             id: consumerRes.id,
//             producerId: consumerRes.producerId,
//             kind: consumerRes.kind,
//             rtpParameters: consumerRes.rtpParameters,
//           });

//           // Now ACK server that client is ready
//           mediaSocket.emit("resume-consumer", {
//             consumerId: consumer.id,
//           });

//           // Attach track to MediaStream / UI FIRST
//           updateParticipantStream(userId, consumer.track);
//         }
//       );
//     }

//     mediaSocket.on("connect", onConnect);

//     return () => {
//       mediaSocket.off("connect", onConnect);
//       if (mediaSocket.connected) {
//         mediaSocket.disconnect();
//       }
//     };
//   }, [sessionCode, name, sessionReady]);
// } //1

export function useMedia(sessionCode: string, name: string) {
  const deviceRef = useRef<Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);
  const updateParticipantStream = useParticipantsStore(
    (state) => state.updateParticipantStream
  );
  const sessionReady = UseSessionStore((state) => state.sessionReady);

  const pendingProducersRef = useRef<
    { producerId: string; kind: string; userId: string }[]
  >([]);

  useEffect(() => {
    console.log("+ useMedia hook triggered", { sessionCode, name, sessionReady });

    if (!sessionCode || !name || !sessionReady) {
      console.log("+ useMedia: missing sessionCode/name/sessionReady, returning");
      return;
    }

    console.log("+ Connecting media socket...");
    mediaSocket.connect();

    const onConnect = () => {
      console.log("+ Socket connected:", mediaSocket.id);

      if (!deviceRef.current) {
        console.log("+ Creating new Device");
        deviceRef.current = new Device();
      }

      const device = deviceRef.current;
      const userId = lsGetItem("userId");
      console.log("+ User ID:", userId);
      if (!userId) return;

      const tryConsumePending = async () => {
        if (!recvTransportRef.current || !deviceRef.current) {
          console.log("+ tryConsumePending: no recvTransport/device yet");
          return;
        }

        if (pendingProducersRef.current.length === 0) {
          console.log("+ tryConsumePending: no pending producers");
          return;
        }

        console.log("+ Consuming pending producers:", pendingProducersRef.current);
        const list = [...pendingProducersRef.current];
        pendingProducersRef.current = [];

        for (const p of list) {
          console.log("+ Consuming producer:", p);
          await consumeProducer(p.producerId, p.kind, p.userId);
        }
      };

      mediaSocket.on("new-producer", ({ producerId, kind, userId }) => {
        console.log("+ Received new-producer event", { producerId, kind, userId });
        pendingProducersRef.current.push({ producerId, kind, userId });
        tryConsumePending();
      });

      // ---- Join media session ----
      console.log("+ Emitting join-media");
      mediaSocket.emit(
        "join-media",
        { sessionCode, userId },
        async (joinRes: any) => {
          console.log("+ join-media response:", joinRes);
          if (!joinRes?.status) return;

          console.log("+ Requesting router RTP capabilities");
          mediaSocket.emit("get-rtp-capabilities", async (rtpRes: any) => {
            console.log("+ get-rtp-capabilities response:", rtpRes);
            if (!rtpRes?.status) return;

            if (!device.loaded) {
              console.log("+ Loading device with RTP capabilities");
              await device.load({ routerRtpCapabilities: rtpRes.data });
            }

            // ---- Create send transport ----
            if (!sendTransportRef.current) {
              console.log("+ Requesting create-send-transport");
              mediaSocket.emit(
                "create-send-transport",
                async (transportRes: any) => {
                  console.log("+ create-send-transport response:", transportRes);
                  if (!transportRes?.status) return;

                  const sendTransport = device.createSendTransport(transportRes);
                  sendTransportRef.current = sendTransport;

                  sendTransport.on(
                    "connect",
                    ({ dtlsParameters }, callback, errback) => {
                      console.log("+ sendTransport connect event", dtlsParameters);
                      mediaSocket.emit(
                        "connect-transport",
                        { dtlsParameters, transportType: "send" },
                        (res: any) => {
                          console.log("+ connect-transport response:", res);
                          if (res?.status) callback();
                          else errback(new Error("DTLS failed"));
                        }
                      );
                    }
                  );

                  sendTransport.on(
                    "produce",
                    ({ kind, rtpParameters }, callback, errback) => {
                      console.log("+ sendTransport produce event", { kind, rtpParameters });
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

                  let stream = useStreamStore.getState().stream;
                  if (!stream) {
                    console.log("+ Waiting for local stream...");
                    stream = await new Promise<MediaStream>((resolve) => {
                      const unsub = useStreamStore.subscribe(
                        (state) => state.stream,
                        (s) => {
                          if (s) {
                            console.log("+ Local stream ready");
                            unsub();
                            resolve(s);
                          }
                        }
                      );
                    });
                  }

                  const audioTrack = stream.getAudioTracks()[0];
                  if (audioTrack) {
                    console.log("+ Producing audio track");
                    await sendTransport.produce({ track: audioTrack });
                  }

                  const videoTrack = stream.getVideoTracks()[0];
                  if (videoTrack) {
                    console.log("+ Producing video track");
                    await sendTransport.produce({ track: videoTrack });
                  }
                }
              );
            }

            // ---- Create recv transport ----
            if (!recvTransportRef.current) {
              console.log("+ Requesting create-recv-transport");
              mediaSocket.emit("create-recv-transport", async (res: any) => {
                console.log("+ create-recv-transport response:", res);
                if (!res?.status) return;

                const recvTransport = device.createRecvTransport(res);
                recvTransportRef.current = recvTransport;

                recvTransport.on(
                  "connect",
                  ({ dtlsParameters }, callback, errback) => {
                    console.log("+ recvTransport connect event", dtlsParameters);
                    mediaSocket.emit(
                      "connect-transport",
                      { dtlsParameters, transportType: "recv" },
                      (res: any) => {
                        console.log("+ connect-transport response:", res);
                        if (res?.status) {
                          callback();
                          tryConsumePending();
                        } else errback(new Error("DTLS failed"));
                      }
                    );
                  }
                );

                if (joinRes?.producers?.length) {
                  console.log("+ Adding existing producers to pending:", joinRes.producers);
                  pendingProducersRef.current.push(...joinRes.producers);
                }

                tryConsumePending();
              });
            }
          });
        }
      );
    };

    async function consumeProducer(producerId: string, _kind: string, userId: string) {
      console.log("+ consumeProducer called", { producerId, _kind, userId });
      if (!deviceRef.current || !recvTransportRef.current) return;

      const device = deviceRef.current;
      const recvTransport = recvTransportRef.current;

      mediaSocket.emit(
        "consume",
        { producerId, rtpCapabilities: device.rtpCapabilities },
        async (consumerRes: any) => {
          console.log("+ consume response:", consumerRes);
          if (!consumerRes?.status) return;

          const consumer = await recvTransport.consume({
            id: consumerRes.id,
            producerId: consumerRes.producerId,
            kind: consumerRes.kind,
            rtpParameters: consumerRes.rtpParameters,
          });

          mediaSocket.emit("resume-consumer", { consumerId: consumer.id });
          console.log("+ consumer track attached for user:", userId);
          updateParticipantStream(userId, consumer.track);
        }
      );
    }

    mediaSocket.on("connect", onConnect);

    return () => {
      console.log("+ Cleaning up media socket listeners");
      mediaSocket.off("connect", onConnect);
      if (mediaSocket.connected) mediaSocket.disconnect();
    };
  }, [sessionCode, name, sessionReady]);
}


