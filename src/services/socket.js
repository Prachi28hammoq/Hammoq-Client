import socketIOClient from "socket.io-client";
export const socket = socketIOClient("https://devcust.avoidpoints.com", {
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});