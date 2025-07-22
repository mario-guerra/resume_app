// src/models/applicationSchema.js
const Joi = require('joi');

const applicationSchema = Joi.object({
  company: Joi.string().required(),
  job_title: Joi.string().required(),
  location: Joi.string().allow(''),
  description: Joi.string().allow(''),
  link: Joi.string().uri().allow(''),
  contact: Joi.string().allow(''),
  referral: Joi.string().allow(''),
  date_applied: Joi.string().isoDate().required(),
  status: Joi.string().valid('applied', 'pending', 'contacted', 'interview', 'rejected', 'closed').required(),
  favorite: Joi.boolean().default(false)
});

module.exports = applicationSchema;
