"use strict";

const ADMIN_WEB_URL_SUCCESS = "http://localhost:3000/auth/login-success";
const USER_WEB_URL_SUCCESS = "http://localhost:3001/auth/login-success";
const USER_APP_URL_SUCCESS = "http://localhost:3002/auth/login-success";
const AUTH_URL_FAILED = "/auth/failed";

const port = process.env.DBWEBB_PORT || 1337;
const path = require("path");
const express = require("express");
const http = require('http'); // Importera http-modulen
const app = express();
const server = http.createServer(app); // Skapa en HTTP-server med Express
const { Server } = require("socket.io"); // Importera Server-klassen från Socket.IO
const io = new Server(server, {
    pingInterval: 60*1000*10,
    pingTimeout: 60*1000*9,
});
const jwt = require('jsonwebtoken');
const { findOrCreateUser, isUserAdmin, getUserInfo } = require('./src/modules/user.js');
const { authenticateJWT, authorizeAdmin } = require("./middleware/auth.js");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require("cors");
const middleware = require("./middleware/index.js");
const v1Router = require("./route/v1/bike.js");
const v2Router = require("./route/v2/api.js");
const v3Router = require("./route/v3/api.js");
const bikeDB = require("./src/modules/bike.js");


// Options for cors
const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin: [
        "http://admin-web:3000",
        "http://user-web:3001",
        "http://user-app:3002",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002"
    ],
    credentials: true,
    optionsSuccessStatus: 200,
};

// Hantera Socket.IO-anslutningar
io.on('connection', (socket) => {
    console.log('A bike connected:', socket.id);
    // const bikes = [];



    socket.on('disconnect', () => {
        // console.log('A bike disconnected:', socket.id);
        console.log(`Bike ${socket.data.bike_id} disconnected.`);
    });

    socket.on('bike-add', (msg) => {
        const bikeId = msg.bike_id;
        if (!bikeId) {
            console.error('Missing bike_id in message.');
            return;
        }
        socket.join('bikes-room'); // Join a single room for all bikes
        socket.data.bike_id = bikeId; // Store the bike ID for targeting
        bikeDB.addBike(
            bikeId,
            msg.battery_level,
            msg.longitude,
            msg.latitude,
            msg.simulation
        );
        console.log(`Bike ${bikeId} added to the system.`);
    });

    // // add bikes to own rooms
    // socket.on('bike-add', (msg) => {
    //     const bikeId = msg.bike_id;
    //     const room = io.sockets.adapter.rooms.get(bikeId);

    //     if (room && room.has(socket.id)) {
    //         console.log(`Bike ${bikeId} is already added by socket ${socket.id}`);
    //         return;
    //     }

    //     if (!bikeId || msg.battery_level === undefined || msg.longitude === undefined || msg.latitude === undefined || msg.simulation === undefined) {
    //         console.error('bike-add: Missing required bike properties');
    //         return;
    //     }

    //     try {
    //         socket.leave(socket.id); // Leave old (automatic) room
    //         socket.join(bikeId); // Add bike to its own rooooom!
    //         socket.data = msg;
    //         // bikeDB.addBike(
    //         //     bikeId,
    //         //     msg.battery_level,
    //         //     msg.longitude,
    //         //     msg.latitude,
    //         //     msg.simulation
    //         // );
    //         console.log(`Bike ${bikeId} added to database and room.`);
    //     } catch (error) {
    //         console.error('bike-add:', error);
    //     }
    // });

    const updateBuffer = [];
    const dbUpdateBuffer = [];
    const EMIT_INTERVAL = 3000; // Emit to frontend 1 per 3 seconds
    const DB_UPDATE_INTERVAL = 10000; // Update db every 10s

    // Function to emit buffered updates
    function emitBufferedUpdates() {
        if (updateBuffer.length > 0) {
            io.emit('bike-update-frontend', updateBuffer);
            updateBuffer.length = 0; // Clear the buffer
        }
    }
    setInterval(emitBufferedUpdates, EMIT_INTERVAL);

    async function processDbUpdates() {
        if (dbUpdateBuffer.length > 0) {
            for (const msg of dbUpdateBuffer) {
                const bikeId = msg.bike_id;
                try {
                    // await bikeDB.updateBike(bikeId, msg);
                    console.log(`Successfully updated bike ${bikeId} in the database.`);
                } catch (error) {
                    console.log(`Error updating bike ${bikeId}:`, error);
                }
            }
            dbUpdateBuffer.length = 0; // Clear the buffer
        }
    }
    setInterval(processDbUpdates, DB_UPDATE_INTERVAL);

    // socket.on('bike-update', (msg) => {
    //     const bikeId = msg.bike_id;
    //     if (bikeId) {
    //         if (io.sockets.adapter.rooms.has(bikeId)) {
    //             const room = io.sockets.adapter.rooms.get(bikeId);

    //             dbUpdateBuffer.push(msg);

    //             room.forEach(socketId => {
    //                 const roomSocket = io.sockets.sockets.get(socketId);
    //                 if (roomSocket) {
    //                     roomSocket.data = msg;
    //                     console.log(`Updated socket data for ${socketId}`);
    //                 }
    //             });
    //         } else {
    //             console.log(`Room ${bikeId} does not exist.`);
    //         }
    //         // Print room count
    //         const rooms = io.sockets.adapter.rooms;
    //         console.log('Rooms:', rooms.size);

    //         // Emit to frontend
    //         updateBuffer.push(msg);
    //         // io.emit('bike-update-admin', msg)
    //     }
    // });
    // socket.on('bike-update', (msg) => {
    //     const bikeId = msg.bike_id;

    // });
    socket.on('bike-update', async (msg) => {
        const bikeId = msg.bike_id;
        if (!bikeId) {
            console.error('bike-update: Missing bike_id in message.');
            return;
        }

        // Find the socket for the bike based on bike_id
        const targetSocket = Array.from(io.sockets.sockets.values()).find(
            (socket) => socket.data.bike_id === bikeId
        );

        if (targetSocket) {
            // Update the socket's data
            targetSocket.data = msg;

            // Add the update to the buffer for broadcasting to the frontend
            updateBuffer.push(msg);


            await bikeDB.updateBike(bikeId, msg);

            // Add the update to the database update buffer
            // dbUpdateBuffer.push(msg);

            console.log(`Updated bike ${bikeId} data for socket ${targetSocket.id}.`);
        } else {
            console.log(`bike-update: No socket found for bike ${bikeId}.`);
        }

        // see how many sockets in "bikes-room" room
        const room = io.sockets.adapter.rooms.get('bikes-room');
        console.log('Sockets in bikes-room:', room ? room.size : 0);
    });


    socket.on('command', (msg) => {
        console.log('command:', msg);

        try {
            // Parse the message if it's a string
            if (typeof msg === 'string') {
                msg = JSON.parse(msg);
            }

            const bikeId = msg.bike_id;
            if (!bikeId) {
                console.error('command: Missing bike_id in message.');
                return;
            }

            console.log(`Sending command to bike ${bikeId}`);
            io.to(bikeId).emit('command', msg);
        } catch (error) {
            console.error('command: Error processing message', error);
        }
    });

});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(cors(corsOptions));

require('dotenv').config({ path: '.env.local' });

app.set("view engine", "ejs");

app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));
server.listen(port, logStartUpDetailsToConsole); // Ändra till server.listen istället för app.listen
app.use(express.urlencoded({ extended: true }));
app.use("/docs", express.static(path.join(__dirname, "docs")));

app.use("/v1", v1Router);
app.use("/v2", v2Router);
app.use("/v3", v3Router);

app.use(require('express-session')({
    secret: 'your-session-secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            await findOrCreateUser(profile);
            return cb(null, profile);
        } catch (error) {
            return cb(error);
        }
    }
));

passport.serializeUser(function (user, done) {
    done(null, user); // Serialize user data into the session
});

passport.deserializeUser(function (obj, done) {
    done(null, obj); // Deserialize user data from the session
});

const ensureAdmin = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        return passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: JSON.stringify({
                successRedirect: ADMIN_WEB_URL_SUCCESS,
            })
        })(req, res, next);
    }

    const isAdmin = await isUserAdmin(req.user.id);
    if (!isAdmin) {
        return res.redirect('/auth/failed');
    }

    next();
};

app.get('/auth/admin-web/google', ensureAdmin, (req, res, next) => {
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({
            successRedirect: ADMIN_WEB_URL_SUCCESS,
        })
    })(req, res, next);
});

app.get('/auth/user-web/google', (req, res, next) => {
    const state = JSON.stringify({
        successRedirect: USER_WEB_URL_SUCCESS,
    });
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: state
    })(req, res, next);
});

app.get('/auth/user-app/google', (req, res, next) => {
    const state = JSON.stringify({
        successRedirect: USER_APP_URL_SUCCESS,
    });
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: state
    })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: AUTH_URL_FAILED }),
    async (req, res) => {
        const state = JSON.parse(req.query.state || "{}");
        const successRedirect = state.successRedirect || "/";

        const user = req.user;
        const user_id = user.id;

        const isAdmin = await isUserAdmin(user_id);
        const role = isAdmin ? 'admin' : 'user';

        const tokenPayload = {
            id: user.id,
            email: user.emails[0].value,
            name: user.displayName,
            image: user.photos[0].value,
            role: role
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

        console.log(token);

        const redirectUrl = isAdmin ? ADMIN_WEB_URL_SUCCESS : successRedirect;
        res.redirect(`${redirectUrl}?token=${token}`);
    }
);

app.get('/user/data', authenticateJWT, async (req, res) => {
    const userId = req.user.id;
    const userInfo = await getUserInfo(userId);
    res.json({
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        image: req.user.image,
        userInfo
    });
});

app.get('/admin/data', [authenticateJWT, authorizeAdmin], (req, res) => {
    res.json({ message: "This is protected admin data." });
});

function logStartUpDetailsToConsole() {
    let routes = [];

    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            middleware.handle.stack.forEach((handler) => {
                let route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
