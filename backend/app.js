"use strict";

const ADMIN_WEB_URL_SUCCESS = "http://localhost:3000/auth/login-success";
const USER_WEB_URL_SUCCESS = "http://localhost:3001/auth/login-success";
const USER_APP_URL_SUCCESS = "http://localhost:3002/auth/login-success";
const AUTH_URL_FAILED = "auth/failed";

const port = process.env.DBWEBB_PORT || 1337;
const path = require("path");
const express = require("express");
const http = require('http'); // Importera http-modulen
const app = express();
const server = http.createServer(app); // Skapa en HTTP-server med Express
const { Server } = require("socket.io"); // Importera Server-klassen från Socket.IO
const io = new Server(server, {
    pingInterval: 25000,  // 25 seconds
    pingTimeout: 60000,    // 1 minute
    cors: {
        origin: [
            "http://admin-web:3000",
            "http://user-web:3001",
            "http://user-app:3002",
            "http://localhost:3000",
            "http://localhost:3001",
            "http://localhost:3002"
        ],
        methods: ["GET", "POST"],
        transports: ["websocket", "polling"],
        credentials: true
    }
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

setInterval(() => {
    const used = process.memoryUsage();
    console.log('---');
    for (let key in used) {
      console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
    console.log('---');
  }, 5000); // Log every 5 seconds


const bikes = {}; // Stores bike data from websockets

/**
 * Function for adding bike to websocket and database.
 *
 * @param {string} bikeId Bike ID
 * @param {number} position Latitude and longitude (as array) -> [longitude, latitude]
 * @param {number} speed Speed of bike
 * @param {number} battery_level Battery level of bike
 * @param {string} status Status of bike
 * @param {boolean} simulated Simulation status of bike (true/false)
 * @param {*} socketId Socket ID of bike
 *
 * @returns {void}
 */
async function addBike(bikeId, position, speed, battery_level, status, simulated, socketId) {
    bikes[bikeId] = {
        position,
        speed,
        battery_level,
        status,
        simulated,
        lastUpdated: Date.now(),
        socketId,
    };

    try {
        // TODO: addBike behöver status och speed
        await bikeDB.addBike(
            bikeId,
            battery_level,
            position[0],
            position[1],
            simulated
        );
        console.log(`WS - [${bikeId}] added to system.`);
    } catch (error) {
        console.error('WS - Error adding bike:', error);
        return;
    }
}

/**
 * Function to update bike data in websocket and database.
 *
 * @param {string} bikeId Bike ID
 * @param {number} position Latitude and longitude (as array) -> [longitude, latitude]
 * @param {number} speed Speed of bike
 * @param {number} battery_level Battery level of bike
 * @param {string} status Status of bike
 * @param {boolean} simulated Simulation status of bike (true/false)
 */
async function updateBike(bikeId, position, speed, battery_level, status, simulated) {
    if (bikes[bikeId]) {
        // If data is the same, don't update or emit
        if (bikes[bikeId].position[0] === position[0] &&
            bikes[bikeId].position[1] === position[1] &&
            bikes[bikeId].speed === speed &&
            bikes[bikeId].battery_level === battery_level &&
            bikes[bikeId].status === status &&
            bikes[bikeId].simulated === simulated) {
            // console.log(`WS - [${bikeId}] data is the same, update not necessary.`); // Disable if too spammy

            return;
        }

        bikes[bikeId].position = position;
        bikes[bikeId].speed = speed;
        bikes[bikeId].status = status;
        bikes[bikeId].battery_level = battery_level;
        bikes[bikeId].simulated = simulated;
        bikes[bikeId].lastUpdated = Date.now();

        await bikeDB.updateBike(bikeId, {
            longitude: position[0],
            latitude: position[1],
            battery_level: battery_level,
            status: status,
            simulated: simulated
        });

        io.emit('bike-update-frontend', {
            bike_id: bikeId,
            latitude: position[1],
            longitude: position[0],
            battery_level: battery_level,
            status: status,
            simulated: simulated
        });

        console.log(`WS - [${bikeId}} updated.`);
    } else {
        console.log(`WS - [${bikeId}] not found.`);
    }
}

/**
 * Funtion to handle sending commands to specific bike (via websocket emit).
 *
 * @param {object} command Command object to send, contains bike_id and command
 *
 * @returns {void}
 */
function sendCommandToBike(command) {
    const bikeId = command.bike_id || null;
    if (bikes[bikeId]) {
        const socketId = bikes[bikeId].socketId;
        const socket = io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit('command', command);

            console.log(`WS - [${bikeId}] Command sent to bike: ${command.command}`);
        } else {
            console.log(`WS - [${bikeId}] Socket not found for bike.`);
        }
    } else {
        console.log(`WS - [${bikeId}] Bike not found.`);
    }
}

/**
 * SocketIO connection handler.
 */
io.on('connection', (socket) => {
    console.log(`WS - [ ${socket.id}] Client connected with ID.`);

    /**
     * Add a bike to websocket system and database.
     *
     * @param {Object} data Data object with bike information
     * @param {string} data.bike_id Bike ID
     * @param {number} data.latitude Latitude for bike
     * @param {number} data.longitude Longitude for bike
     * @param {number} data.speed Speed for bike
     * @param {number} data.battery_level Battery level for bike
     * @param {string} data.status Status for bike
     * @param {boolean} data.simulation Simulation status for bike (true/false)
     * @param {string} data.socketId Socket ID for bike
     *
     * @returns {void}
     */
    socket.on('bike-add', (data) => {
        const bikeId = data.bike_id;
        const position = [data.latitude, data.longitude];
        const speed = data.speed;
        const battery_level = data.battery_level;
        const status = data.status;
        const simulated = data.simulation;

        addBike(bikeId, position, speed, battery_level, status, simulated, socket.id);
        socket.emit('bike-added', { bikeId, position, speed });
    });

    /**
     * Update a bikes information in the websocket system and database.
     *
     * @param {Object} data Data object with bike information
     * @param {string} data.bike_id Bike ID
     * @param {number} data.latitude Latitude for bike
     * @param {number} data.longitude Longitude for bike
     * @param {number} data.speed Speed for bike
     * @param {number} data.battery_level Battery level for bike
     * @param {string} data.status Status for bike
     * @param {boolean} data.simulation Simulation status for bike (true/false)
     *
     * @returns {void}
     */
    socket.on('bike-update', (data) => {
        const bikeId = data.bike_id;
        const position = [data.latitude, data.longitude];
        const speed = data.speed;
        const battery_level = data.battery_level;
        const status = data.status;
        const simulated = data.simulation;

        updateBike(bikeId, position, speed, battery_level, status, simulated);

        socket.emit('bike-updated', { bikeId, position, speed });
    });

    /**
     * Handles commands sent to update bikes.
     *
     * @param {string} command Command object to send, contains bike_id and command
     *
     * @returns {void}
     */
    socket.on('command', (command) => {
        command = JSON.parse(command); // Convert to json object
        sendCommandToBike(command);
    });

    /**
     * Handle socket disconnects (only logs to console).
     */
    socket.on('disconnect', () => {
        console.log(`WS - [${socket.id}] Client disconnected with socket-ID.`);
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
            scope: ['profile', 'email']
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

app.get('/auth/failed', (req, res) => {
    res.redirect(`${ADMIN_WEB_URL_SUCCESS}?error=true`);
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

        const redirectUrl = successRedirect;
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
