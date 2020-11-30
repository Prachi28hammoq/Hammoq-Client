import socketIOClient from "socket.io-client";
export const socket = socketIOClient("http://stageapp.avoidpoints.com", {
  transportOptions: { polling: { extraHeaders: { Accept: "*/*" } } },
});
