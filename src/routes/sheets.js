// src/routes/sheets.js
const express = require('express');
const router = express.Router();
const authenticate = require('../utils/authMiddleware');
const sheetsService = require('../services/sheetsService');

// POST /sheets/init
router.post('/init', authenticate, async (req, res) => {
  try {
    const result = await sheetsService.initSheet(req.user);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Sheet initialization failed', details: err.message });
  }
});

module.exports = router;
