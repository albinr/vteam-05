// rateLimit.js
const rateLimit = require('express-rate-limit');

const userWebLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests for user web, please try again later.",
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

const userAppLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  message: "Too many requests for user app, please try again later.",
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

const adminWebLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2,
  message: "Too many requests for admin web, please try again later.",
  keyGenerator: (req) => req.headers['x-api-key'] || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

function getLimiterForApiKey(apiKey) {
  if (apiKey === process.env.USER_WEB_CLIENT_ID) return userWebLimiter;
  if (apiKey === process.env.USER_APP_CLIENT_ID) return userAppLimiter;
  if (apiKey === process.env.ADMIN_WEB_CLIENT_ID) return adminWebLimiter;
  return userWebLimiter;
}

module.exports = getLimiterForApiKey;
