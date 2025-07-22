require('dotenv').config();
// src/services/googleAuth.js
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
  'profile',
  'email'
];

function getOAuthClient() {
  console.log('[googleAuth] CLIENT_ID:', CLIENT_ID);
  console.log('[googleAuth] CLIENT_SECRET:', CLIENT_SECRET ? '***' : '(not set)');
  console.log('[googleAuth] REDIRECT_URI:', REDIRECT_URI);
  return new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
}

function generateAuthUrl() {
  const client = getOAuthClient();
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
  console.log('[googleAuth] Generated Auth URL:', url);
  return url;
}

async function getTokens(code) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

module.exports = {
  generateAuthUrl,
  getTokens
};
