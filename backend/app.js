/**
 * A sample Express server with static resources.
 */
"use strict";

const port = process.env.DBWEBB_PORT || 1337;
const path = require("path");
const express = require("express");
const app = express();
const middleware = require("./middleware/index.js");

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
    callbackURL: "/auth/google/callback"
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

// app.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/failed' }),
//     function (req, res) {
//         // Successful authentication, redirect home.
//         // res.redirect('/');

//         res.redirect(req.url);
//     });

app.get('/auth/google', (req, res, next) => {
    const returnUrl = req.query.returnUrl || '/';
    const redirectUrl = `/auth/google/callback?returnUrl=${encodeURIComponent(returnUrl)}`;
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        state: JSON.stringify({ returnUrl }) // Optional: Encode additional state info
    })(req, res, next);
});

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    (req, res) => {
        const returnUrl = req.query.returnUrl || '/';
        res.redirect(returnUrl);
    }
);


// app.listen(3000, () => console.log('Server is running on port 3000'));


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
        "http://user-app:8081"
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
