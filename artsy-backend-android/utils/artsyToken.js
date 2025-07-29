const axios = require('axios');
require('dotenv').config();
const AUTH_URL = process.env.AUTH_URL;
const CLIENT_ID = process.env.ARTSY_CLIENT_ID;
const CLIENT_SECRET = process.env.ARTSY_CLIENT_SECRET;
let _cachedToken  = null;
let _expiresAt    = 0;

async function getAuthToken() {
  const now = Date.now();
  if (_cachedToken && now < _expiresAt) {
    return _cachedToken;
  }

  const { data } = await axios.post(AUTH_URL, {
    client_id:     CLIENT_ID,
    client_secret: CLIENT_SECRET
  });

  _cachedToken = data.token;
  _expiresAt  = now + data.expires_in * 1000 - 60_000;  
  return _cachedToken;
}

module.exports = { getAuthToken };