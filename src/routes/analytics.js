// src/routes/analytics.js
const express = require('express');
const router = express.Router();
const authenticate = require('../utils/authMiddleware');
const sheetsService = require('../services/sheetsService');

// GET /analytics/summary
router.get('/summary', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    const summary = await sheetsService.getAnalyticsSummary(req.user, sheetId);
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get analytics summary', details: err.message });
  }
});

// GET /analytics/trends
router.get('/trends', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    const trends = await sheetsService.getAnalyticsTrends(req.user, sheetId);
    res.status(200).json(trends);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get analytics trends', details: err.message });
  }
});

module.exports = router;
