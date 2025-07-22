// src/routes/applications.js
const express = require('express');
const router = express.Router();
const authenticate = require('../utils/authMiddleware');
const sheetsService = require('../services/sheetsService');

// GET /applications
router.get('/', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    const apps = await sheetsService.listApplications(req.user, sheetId);
    res.status(200).json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list applications', details: err.message });
  }
});

const applicationSchema = require('../models/applicationSchema');

// POST /applications
router.post('/', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  const { error, value } = applicationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details });
  }
  try {
    const app = await sheetsService.createApplication(req.user, sheetId, value);
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create application', details: err.message });
  }
});

// GET /applications/:id
router.get('/:id', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    const app = await sheetsService.getApplication(req.user, sheetId, req.params.id);
    res.status(200).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get application', details: err.message });
  }
});

// PUT /applications/:id
router.put('/:id', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  const { error, value } = applicationSchema.validate(req.body, { presence: 'optional' });
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details });
  }
  try {
    const app = await sheetsService.updateApplication(req.user, sheetId, req.params.id, value);
    res.status(200).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application', details: err.message });
  }
});

// DELETE /applications/:id
router.delete('/:id', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    await sheetsService.deleteApplication(req.user, sheetId, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete application', details: err.message });
  }
});

// POST /applications/:id/favorite
router.post('/:id/favorite', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    // For now, treat as an update with favorite field
    const app = await sheetsService.updateApplication(req.user, sheetId, req.params.id, { favorite: req.body.favorite });
    res.status(200).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update favorite', details: err.message });
  }
});

module.exports = router;
