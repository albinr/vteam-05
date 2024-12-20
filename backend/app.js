/**
 * A sample Express server with static resources.
 */
"use strict";

const ADMIN_WEB_URL_SUCCESS = "http://localhost:3000/auth/login-success";
const USER_WEB_URL_SUCCESS = "http://localhost:3001/";
const USER_APP_URL_SUCCESS = "http://localhost:8081/";
const AUTH_URL_FAILED = "/auth/failed";

const port = process.env.DBWEBB_PORT || 1337;
const path = require("path");
const express = require("express");
const app = express();
const middleware = require("./middleware/index.js");
const jwt = require('jsonwebtoken');

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const v1Router = require("./route/v1/bike.js");
const v2Router = require("./route/v2/api.js");

const cors = require("cors");

require('dotenv').config({ path: '.env.local' });

app.set("view engine", "ejs");

app.use(middleware.logIncomingToConsole);
app.use(express.static(path.join(__dirname, "public")));
app.listen(port, logStartUpDetailsToConsole);
app.use(express.urlencoded({ extended: true }));
app.use("/docs", express.static(path.join(__dirname, "docs")));

app.use("/v1", v1Router);
app.use("/v2", v2Router);

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
    function (accessToken, refreshToken, profile, cb) {
        // Här kan du spara användarprofilen i din databas
        console.log(profile);

        return cb(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user); // Serialize user data into the session
});

passport.deserializeUser(function(obj, done) {
    done(null, obj); // Deserialize user data from the session
});

// app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(AUTH_URL_FAILED, (req, res, next) => {
    res.send("Login failed, please go back to the original page and try again.");
});

// TODO: Check if user is admin!
app.get('/auth/admin-web/google', (req, res, next) => {
    const state = JSON.stringify({
        successRedirect: ADMIN_WEB_URL_SUCCESS,
    });
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: state
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
    (req, res) => {
        const state = JSON.parse(req.query.state || "{}");

        const successRedirect = state.successRedirect || "/";

        const user = req.user;

        const token = jwt.sign({
            id: user.id,
            email: user.emails[0].value,
            name: user.displayName,
            image: user.photos[0].value
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        console.log(token);

        res.redirect(successRedirect + "?token=" + token);
    }
);

// app.get(
//     (req, res, next) => {
//         const state = JSON.parse(req.query.state || "{}");

//         const failureRedirect = state.failureRedirect || "/failed";

//         passport.authenticate('google', {
//             failureRedirect: failureRedirect,
//         })(req, res, next);
//     },
//     (req, res) => {
//         const state = JSON.parse(req.query.state || "{}");

//         const successRedirect = state.successRedirect || "/";
//         res.redirect(successRedirect);
//     }
// );

// Options for cors
const corsOptions = {
    headers: [
        { key: "Access-Control-Allow-Credentials", value: "true" },
        { key: "Access-Control-Allow-Origin", value: "*" },
        // ...
    ],
    origin: [
        "http://admin-web:3000",
        "http://user-web:3001",
        "http://user-app:8081",
        "http://user-app:1900",
        "http://user-app:1901",
        "http://user-app:1902",
        "http://user-app:1903",
        "http://user-app:1906",
        "http://localhost:1900",
        "http://localhost:1901",
        "http://localhost:1902",
        "http://localhost:1903",
        "http://localhost:1906",
        // "*"
    ],
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};


app.use(cors(corsOptions)); // Added for cors thingy

// cors(corsOptions)

// Read from commandline

/**
 * Log app details to console when starting up.
 *
 * @return {void}
 */
function logStartUpDetailsToConsole() {
    let routes = [];

    // Find what routes are supported
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            // Routes registered directly on the app
            routes.push(middleware.route);
        } else if (middleware.name === "router") {
            // Routes added as router middleware
            middleware.handle.stack.forEach((handler) => {
                let route;

                route = handler.route;
                route && routes.push(route);
            });
        }
    });

    console.info(`Server is listening on port ${port}.`);
    console.info("Available routes are:");
    console.info(routes);
}
