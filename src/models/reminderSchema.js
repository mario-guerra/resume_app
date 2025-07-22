// src/models/reminderSchema.js
const Joi = require('joi');

const reminderSchema = Joi.object({
  application_id: Joi.string().required(),
  reminder_date: Joi.string().isoDate().required(),
  note: Joi.string().allow('')
});

module.exports = reminderSchema;
