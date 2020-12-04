import socketIOClient from "socket.io-client";
export const socket = socketIOClient("https://app.hammoq.com", {
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});
