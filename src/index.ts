import { io } from "socket.io-client";

// Establish connection
const socket = io("ws://localhost:3000");

/**
 * Socket.io event handlers
 */
socket.on("init", (data) => {
    const jsonData = JSON.parse(data);
    console.log(jsonData);
});