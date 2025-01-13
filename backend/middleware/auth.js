// src/middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ message: "Access denied: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.json({ message: "Access denied: Invalid token" });
        }
        req.user = user;
        next();
    });
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.json({ message: "Access denied: Admins only" });
    }
    next();
};

const authUserOrAdmin = (req, res, next) => {
    const userId = req.params.userId;
    if (req.user.id === userId || req.user.role === 'admin') {
        return next();
    }

    return res.json({ message: "Access denied: You are not authorized to update this user" });
};

module.exports = {
    authenticateJWT,
    authorizeAdmin,
    authUserOrAdmin
};