import { io, Socket } from "socket.io-client";

// Create a single shared socket instance
// The empty string means "connect to the same host that served this page"
// Vite's proxy will forward it to localhost:5000
let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io("/", {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};