import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SIGNALING_URL!;
const MEDIA_SOCKET_URL = import.meta.env.MEDIA_SOCKET_URL!;

export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});

export const mediaSocket: Socket = io(MEDIA_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
