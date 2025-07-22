// src/services/sheetsService.js
// Placeholder for Google Sheets CRUD and schema management

const { google } = require('googleapis');

async function initSheet(user) {
  // Requires: user.googleTokens.access_token and user.googleTokens.refresh_token
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  // Create the spreadsheet
  const spreadsheet = await sheets.spreadsheets.create({
    resource: {
      properties: { title: 'Job_Tracker' },
      sheets: [
        { properties: { title: 'Applications' } },
        { properties: { title: 'Reminders' } }
      ]
    }
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;

  // Write header rows
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Applications!A1:K1',
    valueInputOption: 'RAW',
    resource: { values: [[
      'id','company','job_title','location','description','link','contact','referral','date_applied','status','favorite'
    ]] }
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Reminders!A1:D1',
    valueInputOption: 'RAW',
    resource: { values: [[
      'id','application_id','reminder_date','note'
    ]] }
  });

  // Optionally, set permissions so only the user can access (already default for user's Drive)
  // Return spreadsheet info
  return {
    spreadsheet_id: spreadsheetId,
    spreadsheet_url: spreadsheet.data.spreadsheetUrl
  };
}

async function listApplications(user, sheetId) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows from Applications tab
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Applications'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) return []; // Only header or empty

  const header = rows[0];
  const apps = rows.slice(1).map(row => {
    const obj = {};
    header.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    // Convert types
    if ('favorite' in obj) obj.favorite = obj.favorite === 'TRUE' || obj.favorite === true;
    return obj;
  });
  return apps;
}

const { v4: uuidv4 } = require('uuid');

async function createApplication(user, sheetId, data) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read header to get column order
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Applications!A1:K1'
  });
  const header = headerRes.data.values[0];

  // Generate unique ID
  const id = uuidv4();
  const row = header.map(col => {
    if (col === 'id') return id;
    if (col === 'favorite') return data.favorite ? 'TRUE' : 'FALSE';
    return data[col] !== undefined ? data[col] : '';
  });

  // Append row
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Applications',
    valueInputOption: 'RAW',
    resource: { values: [row] }
  });

  // Return the created application object
  const app = { id, ...data, favorite: !!data.favorite };
  return app;
}

async function getApplication(user, sheetId, id) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows from Applications tab
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Applications'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) return null;

  const header = rows[0];
  const app = rows.slice(1).map(row => {
    const obj = {};
    header.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    if ('favorite' in obj) obj.favorite = obj.favorite === 'TRUE' || obj.favorite === true;
    return obj;
  }).find(app => app.id === id);

  return app || null;
}

async function updateApplication(user, sheetId, id, data) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows to find the row index
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Applications'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) throw new Error('No applications found');

  const header = rows[0];
  const rowIndex = rows.slice(1).findIndex(row => row[0] === id);
  if (rowIndex === -1) throw new Error('Application not found');

  // Merge existing row with new data
  const existingRow = rows[rowIndex + 1];
  const updatedRow = header.map((col, idx) => {
    if (col === 'id') return id;
    if (col === 'favorite') return data.favorite !== undefined ? (data.favorite ? 'TRUE' : 'FALSE') : existingRow[idx];
    return data[col] !== undefined ? data[col] : existingRow[idx];
  });

  // Update the row in the sheet
  const range = `Applications!A${rowIndex + 2}:K${rowIndex + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values: [updatedRow] }
  });

  // Return updated application object
  const app = {};
  header.forEach((col, idx) => {
    app[col] = updatedRow[idx];
  });
  if ('favorite' in app) app.favorite = app.favorite === 'TRUE' || app.favorite === true;
  return app;
}

async function deleteApplication(user, sheetId, id) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows to find the row index
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Applications'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) throw new Error('No applications found');

  const rowIndex = rows.slice(1).findIndex(row => row[0] === id);
  if (rowIndex === -1) throw new Error('Application not found');

  // Delete the row (rowIndex + 2 because of header and 1-based index)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0, // Assumes "Applications" is the first sheet; adjust if needed
              dimension: 'ROWS',
              startIndex: rowIndex + 1,
              endIndex: rowIndex + 2
            }
          }
        }
      ]
    }
  });
}

async function listReminders(user, sheetId) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows from Reminders tab
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Reminders'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) return []; // Only header or empty

  const header = rows[0];
  const reminders = rows.slice(1).map(row => {
    const obj = {};
    header.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
  return reminders;
}

async function createReminder(user, sheetId, data) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read header to get column order
  const headerRes = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Reminders!A1:D1'
  });
  const header = headerRes.data.values[0];

  // Generate unique ID
  const id = uuidv4();
  const row = header.map(col => {
    if (col === 'id') return id;
    return data[col] !== undefined ? data[col] : '';
  });

  // Append row
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Reminders',
    valueInputOption: 'RAW',
    resource: { values: [row] }
  });

  // Return the created reminder object
  const reminder = { id, ...data };
  return reminder;
}

async function updateReminder(user, sheetId, id, data) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows to find the row index
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Reminders'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) throw new Error('No reminders found');

  const header = rows[0];
  const rowIndex = rows.slice(1).findIndex(row => row[0] === id);
  if (rowIndex === -1) throw new Error('Reminder not found');

  // Merge existing row with new data
  const existingRow = rows[rowIndex + 1];
  const updatedRow = header.map((col, idx) => {
    if (col === 'id') return id;
    return data[col] !== undefined ? data[col] : existingRow[idx];
  });

  // Update the row in the sheet
  const range = `Reminders!A${rowIndex + 2}:D${rowIndex + 2}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'RAW',
    resource: { values: [updatedRow] }
  });

  // Return updated reminder object
  const reminder = {};
  header.forEach((col, idx) => {
    reminder[col] = updatedRow[idx];
  });
  return reminder;
}

async function deleteReminder(user, sheetId, id) {
  const tokens = user.googleTokens;
  if (!tokens || !tokens.access_token) {
    throw new Error('Missing Google OAuth tokens');
  }
  if (!sheetId) {
    throw new Error('Missing sheetId');
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all rows to find the row index
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Reminders'
  });

  const rows = result.data.values || [];
  if (rows.length < 2) throw new Error('No reminders found');

  const rowIndex = rows.slice(1).findIndex(row => row[0] === id);
  if (rowIndex === -1) throw new Error('Reminder not found');

  // Delete the row (rowIndex + 2 because of header and 1-based index)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    resource: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 1, // Assumes "Reminders" is the second sheet; adjust if needed
              dimension: 'ROWS',
              startIndex: rowIndex + 1,
              endIndex: rowIndex + 2
            }
          }
        }
      ]
    }
  });
}

async function getAnalyticsSummary(user, sheetId) {
  // Compute analytics summary from Applications tab
  const apps = await listApplications(user, sheetId);
  const total = apps.length;
  const responded = apps.filter(a => a.status && a.status !== 'applied' && a.status !== 'pending').length;
  const interviews = apps.filter(a => a.status === 'interview').length;
  const companies = {};
  apps.forEach(a => {
    if (a.company) companies[a.company] = (companies[a.company] || 0) + 1;
  });
  const topCompanies = Object.entries(companies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return {
    total_applications: total,
    response_rate: total ? responded / total : 0,
    interview_rate: total ? interviews / total : 0,
    top_companies: topCompanies
  };
}

async function getAnalyticsTrends(user, sheetId) {
  // Compute analytics trends from Applications tab
  const apps = await listApplications(user, sheetId);
  const roles = {};
  const companies = {};
  const trends = {};

  apps.forEach(a => {
    if (a.job_title) roles[a.job_title] = (roles[a.job_title] || 0) + 1;
    if (a.company) companies[a.company] = (companies[a.company] || 0) + 1;
    if (a.date_applied && a.date_applied.length >= 7) {
      const month = a.date_applied.slice(0, 7);
      trends[month] = (trends[month] || 0) + 1;
    }
  });

  const topRoles = Object.entries(roles)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const topCompanies = Object.entries(companies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  const applicationTrends = Object.entries(trends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({ month, count }));

  return {
    top_roles: topRoles,
    top_companies: topCompanies,
    application_trends: applicationTrends
  };
}

module.exports = {
  initSheet,
  listApplications,
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  listReminders,
  createReminder,
  updateReminder,
  deleteReminder,
  getAnalyticsSummary,
  getAnalyticsTrends
};
