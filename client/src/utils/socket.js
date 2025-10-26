import { io } from "socket.io-client";

const SOCKET_URL = io("http://localhost:5000"); // Flash backend címe
export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
});