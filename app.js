require('dotenv').config();
// app.js
const express = require('express');
const app = express();

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', require('./src/routes/auth'));
app.use('/sheets', require('./src/routes/sheets'));
app.use('/applications', require('./src/routes/applications'));
app.use('/reminders', require('./src/routes/reminders'));
app.use('/analytics', require('./src/routes/analytics'));

// Placeholder for API routes
// Example: app.use('/auth', require('./src/routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
