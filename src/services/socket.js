import socketIOClient from "socket.io-client";
export const socket = socketIOClient("https://stageapp.avoidpoints.com", {
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});
