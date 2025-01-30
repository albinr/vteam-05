// apiKeyValidation.js
const getLimiterForApiKey = require('./rateLimit.js');

function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = apiKey === process.env.USER_WEB_CLIENT_ID ? 'USER_WEB' 
    : apiKey === process.env.USER_APP_CLIENT_ID ? 'USER_APP' 
    : apiKey === process.env.ADMIN_WEB_CLIENT_ID ? 'ADMIN_WEB' 
    : null;

  if (!apiKey || !expectedKey) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  // Hämta och använd den tidigare skapade limiter
  const limiter = getLimiterForApiKey(apiKey);
  limiter(req, res, next);
}

module.exports = validateApiKey;