/**
 * General middleware.
 */
"use strict";

/**
 * Log incoming requests to console to see who accesses the server
 * on what route.
 *
 * @param {Request}  req  The incoming request.
 * @param {Response} res  The outgoing response.
 * @param {Function} next Next to call in chain of middleware.
 *
 * @returns {void}
 */
function logIncomingToConsole(req, res, next) {
    console.info(`Got request on ${req.path} (${req.method}).`);
    next();
}

const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Antag "Bearer <token>"

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Förbjuden om token är ogiltig
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Obehörig om ingen token finns
    }
}


module.exports = {
    logIncomingToConsole: logIncomingToConsole,
    authenticateJWT
};