"use strict";

const port = process.env.DBWEBB_PORT || 1337;
const path = require("path");
const express = require("express");
const http = require("http"); // HTTP server for WebSocket
const cors = require("cors");

const app = express();
const server = http.createServer(app); // HTTP server instance
const middleware = require("./middleware/index.js");
const v1Router = require("./route/v1/bike.js");

// Import WebSocket server
const { initializeWebSocketServer } = require("./route/v1/wsServer.js");

// Initialize WebSocket server
const { broadcastToBikes } = initializeWebSocketServer(server);

// Middleware and static file handling
app.set("view engine", "ejs");
app.use(cors());
app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/v1", v1Router);

// Example API Route: Broadcast a message to all bikes
app.post("/v1/broadcast", (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    broadcastToBikes({ event: "server_broadcast", message });
    res.json({ success: "Message broadcasted to all bikes" });
});

// Start the HTTP and WebSocket server
server.listen(port, () => {
    console.info(`Server is listening on port ${port}`);
});
