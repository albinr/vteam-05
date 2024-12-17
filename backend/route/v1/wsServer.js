"use strict";

const WebSocket = require("ws");

// Manage bike WebSocket connections
const bikeConnections = new Map();

function initializeWebSocketServer(server) {
    // Attach WebSocket server to HTTP server
    const wss = new WebSocket.Server({ server });

    console.log("WebSocket server initialized.");

    wss.on("connection", (ws) => {
        console.log("WebSocket connection established.");

        // Assign a unique ID to each bike
        const bikeId = `bike-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        bikeConnections.set(bikeId, ws);
        console.log(`Bike connected: ${bikeId}`);

        // Send welcome message
        ws.send(JSON.stringify({ message: "Connected to WebSocket server", bikeId }));

        // Handle incoming messages
        ws.on("message", (data) => {
            console.log(`Received message from ${bikeId}:`, data);
        });

        // Handle disconnection
        ws.on("close", () => {
            console.log(`Bike disconnected: ${bikeId}`);
            bikeConnections.delete(bikeId);
        });

        // Handle errors
        ws.on("error", (error) => {
            console.error(`Error on bike ${bikeId}:`, error.message);
            bikeConnections.delete(bikeId);
        });
    });

    // Function to broadcast messages to all connected bikes
    function broadcastToBikes(message) {
        for (const [id, ws] of bikeConnections.entries()) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        }
    }

    // Export the broadcast function
    return { broadcastToBikes };
}

module.exports = { initializeWebSocketServer };
