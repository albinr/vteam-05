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
const io = new Server(server); // Skapa en Socket.IO-server kopplad till HTTP-servern
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
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected:', socket.id);
    });

    // Exempel på en anpassad händelse
    socket.on('message', (msg) => {
        console.log('message:', msg);
        // io.emit('message', msg);
    });

    socket.on('bike-update', (msg) => {
        console.log('bike-update:', msg);
        io.emit('message', msg);
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

passport.serializeUser(function(user, done) {
    done(null, user); // Serialize user data into the session
});

passport.deserializeUser(function(obj, done) {
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
