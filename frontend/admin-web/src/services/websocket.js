import { io } from "socket.io-client";

let socket;

export const initializeWebSocket = () => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socket.on("connect", () => {
            console.log("Connected to WebSocket server:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from WebSocket server.");
        });

        socket.on("connect_error", (error) => {
            console.error("WebSocket connection error:", error);
        });
    }
    return socket;
};

export const getWebSocket = () => {
    if (!socket) {
        throw new Error("WebSocket not initialized. Call initializeWebSocket first.");
    }
    return socket;
};
