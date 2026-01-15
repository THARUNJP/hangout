import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SIGNALING_URL;

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

// export const mediaSocket: Socket = io(`${SOCKET_URL}/mediasoup`, {
//   autoConnect: false,
//   transports: ["websocket"],
// });

export const mediaSocket: Socket = io(
  `wss://ec2-65-2-80-63.ap-south-1.compute.amazonaws.com/mediasoup`,
  {
    transports: ["websocket"],
    autoConnect: false,
  }
);
