// src/routes/reminders.js
const express = require('express');
const router = express.Router();
const authenticate = require('../utils/authMiddleware');
const sheetsService = require('../services/sheetsService');

// GET /reminders
router.get('/', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    const reminders = await sheetsService.listReminders(req.user, sheetId);
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list reminders', details: err.message });
  }
});

const reminderSchema = require('../models/reminderSchema');

// POST /reminders
router.post('/', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  const { error, value } = reminderSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details });
  }
  try {
    const reminder = await sheetsService.createReminder(req.user, sheetId, value);
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create reminder', details: err.message });
  }
});

// PUT /reminders/:id
router.put('/:id', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  const { error, value } = reminderSchema.validate(req.body, { presence: 'optional' });
  if (error) {
    return res.status(400).json({ error: 'Validation failed', details: error.details });
  }
  try {
    const reminder = await sheetsService.updateReminder(req.user, sheetId, req.params.id, value);
    res.status(200).json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update reminder', details: err.message });
  }
});

// DELETE /reminders/:id
router.delete('/:id', authenticate, async (req, res) => {
  const sheetId = req.query.sheetId;
  if (!sheetId) {
    return res.status(400).json({ error: 'Missing sheetId query parameter' });
  }
  try {
    await sheetsService.deleteReminder(req.user, sheetId, req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete reminder', details: err.message });
  }
});

module.exports = router;
