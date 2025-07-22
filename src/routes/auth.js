// src/routes/auth.js
const express = require('express');
const router = express.Router();

const googleAuth = require('../services/googleAuth');

// Initiate Google OAuth flow
router.get('/google', (req, res) => {
  const url = googleAuth.generateAuthUrl();
  res.redirect(url);
});

// Handle OAuth callback and token exchange
router.get('/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }
  try {
    const tokens = await googleAuth.getTokens(code);
    const jwtSign = require('jsonwebtoken').sign;
    const idToken = tokens.id_token;
    let userInfo = {};
    if (idToken) {
      // Decode ID token to get user info
      userInfo = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    }
    const jwtPayload = {
      sub: userInfo.sub,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      googleTokens: tokens // In production, store securely, not in JWT
    };
    const jwtToken = jwtSign(jwtPayload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' });
    res.status(200).json({ jwt: jwtToken, user: userInfo });
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed', details: err.message });
  }
});

module.exports = router;
