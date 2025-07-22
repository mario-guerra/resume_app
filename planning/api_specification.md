# API Specification: Job Application Tracker

## Overview

This API supports a mobile-first job application tracker app, using Google Sheets as the backend data store and Google OAuth for authentication. All endpoints (except authentication) require a valid Google OAuth token. Data access is scoped to the authenticated user.

---

## Google Sheets Integration

- **Data Storage:** All job application and reminder data is stored in a Google Sheet in the user's Google Drive. Each row represents a job application, with columns for each field. Reminders and analytics may use separate sheets or additional columns.
- **Authentication:** The API requires the user's Google OAuth token with the `https://www.googleapis.com/auth/spreadsheets` scope to access and modify their sheet.
- **CRUD Operations:** All create, read, update, and delete operations are performed by interacting with the Google Sheets API, mapping API requests to row/column operations.
- **User Data Isolation:** Each user's data is isolated by using a dedicated sheet per user or user-specific tabs within a shared sheet.
- **Schema:** The sheet columns correspond to the job application fields (e.g., id, company, job_title, location, etc.). Reminders and analytics data are similarly structured.
- **Error Handling:** The API translates Google Sheets API errors (e.g., permission denied, not found, quota exceeded) into appropriate HTTP responses.
- **Performance:** The API handles Google Sheets API rate limits and latency, using batching and retries as needed.

---

## 1. Authentication & Authorization

### OAuth 2.0 with Google

- **Endpoints:**
  - `GET /auth/google`  
    Initiates Google OAuth flow.
  - `GET /auth/callback`  
    Handles OAuth callback, returns JWT or session.

- **Requirements:**
  - All other endpoints require a Bearer token (JWT) from Google OAuth.
  - Each user can only access and modify their own data.

---

## 2. Endpoints

### Sheet Initialization

- `POST /sheets/init`
  - **Description:** Creates a new Google Sheet in the user's Drive to track job applications and reminders. The sheet title is required and must be "Job_Tracker". Initializes the sheet with the required columns and structure.
  - **Authentication:** Requires Google OAuth token with `https://www.googleapis.com/auth/drive` and `https://www.googleapis.com/auth/spreadsheets` scopes.
  - **Request:**  
    ```json
    {
      "sheet_title": "Job_Tracker"
    }
    ```
  - **Response:**  
    `201 Created`
    ```json
    {
      "spreadsheet_id": "string",
      "spreadsheet_url": "string"
    }
    ```
  - **Errors:**  
    - `400 Bad Request` if sheet_title is missing or not "Job_Tracker"
    - `401 Unauthorized` if token is missing or invalid
    - `429 Too Many Requests` if rate limited
    - `500 Internal Server Error` for other failures

---

- `GET /applications`
  - **Description:** List all job applications for the authenticated user.
  - **Response:**  
    `200 OK`  
    ```json
    [
      {
        "id": "string",
        "company": "string",
        "job_title": "string",
        "location": "string",
        "description": "string",
        "link": "string",
        "contact": "string",
        "referral": "string",
        "date_applied": "string (ISO8601)",
        "status": "applied|pending|contacted|interview|rejected|closed",
        "favorite": true
      }
    ]
    ```

- `POST /applications`
  - **Description:** Create a new job application.
  - **Request:**  
    ```json
    {
      "company": "string",
      "job_title": "string",
      "location": "string",
      "description": "string",
      "link": "string",
      "contact": "string",
      "referral": "string",
      "date_applied": "string (ISO8601)",
      "status": "applied|pending|contacted|interview|rejected|closed",
      "favorite": true
    }
    ```
  - **Response:**  
    `201 Created`  
    (Job Application object as above)

- `GET /applications/{id}`
  - **Description:** Get details for a specific application.
  - **Response:**  
    `200 OK`  
    (Job Application object)

- `PUT /applications/{id}`
  - **Description:** Update a job application.
  - **Request:**  
    (Any updatable fields from the Job Application object)
  - **Response:**  
    `200 OK`  
    (Updated Job Application object)

- `DELETE /applications/{id}`
  - **Description:** Delete a job application.
  - **Response:**  
    `204 No Content`

---

### Reminders

- `GET /reminders`
  - **Description:** List all reminders for the user.
  - **Response:**  
    `200 OK`  
    ```json
    [
      {
        "id": "string",
        "application_id": "string",
        "reminder_date": "string (ISO8601)",
        "note": "string"
      }
    ]
    ```

- `POST /reminders`
  - **Description:** Create a new reminder.
  - **Request:**  
    ```json
    {
      "application_id": "string",
      "reminder_date": "string (ISO8601)",
      "note": "string"
    }
    ```
  - **Response:**  
    `201 Created`  
    (Reminder object as above)

- `PUT /reminders/{id}`
  - **Description:** Update a reminder.
  - **Request:**  
    (Any updatable fields from the Reminder object)
  - **Response:**  
    `200 OK`  
    (Updated Reminder object)

- `DELETE /reminders/{id}`
  - **Description:** Delete a reminder.
  - **Response:**  
    `204 No Content`

---

### Analytics

- `GET /analytics/summary`
  - **Description:** Returns counts, response rates, and basic stats.
  - **Response:**  
    `200 OK`  
    ```json
    {
      "total_applications": 42,
      "response_rate": 0.25,
      "interview_rate": 0.10,
      "top_companies": ["Acme Corp", "Globex"]
    }
    ```

- `GET /analytics/trends`
  - **Description:** Returns trends (e.g., top companies, best-fit roles).
  - **Response:**  
    `200 OK`  
    ```json
    {
      "top_roles": ["Software Engineer", "Product Manager"],
      "top_companies": ["Acme Corp", "Globex"],
      "application_trends": [
        {"month": "2025-06", "count": 10},
        {"month": "2025-07", "count": 15}
      ]
    }
    ```

---

### Favorites

- `POST /applications/{id}/favorite`
  - **Description:** Mark or unmark a job as favorite.
  - **Request:**  
    ```json
    {
      "favorite": true
    }
    ```
  - **Response:**  
    `200 OK`  
    (Updated Job Application object)

---

## 3. Data Models

### Job Application

```json
{
  "id": "string",
  "company": "string",
  "job_title": "string",
  "location": "string",
  "description": "string",
  "link": "string",
  "contact": "string",
  "referral": "string",
  "date_applied": "string (ISO8601)",
  "status": "applied|pending|contacted|interview|rejected|closed",
  "favorite": true
}
```

### Reminder

```json
{
  "id": "string",
  "application_id": "string",
  "reminder_date": "string (ISO8601)",
  "note": "string"
}
```

### Analytics Summary

```json
{
  "total_applications": 42,
  "response_rate": 0.25,
  "interview_rate": 0.10,
  "top_companies": ["Acme Corp", "Globex"]
}
```

---

## 4. Security

- All endpoints (except `/auth/google` and `/auth/callback`) require Bearer token (JWT) from Google OAuth.
- Data access is strictly scoped to the authenticated user.

---

## 5. Integration

- All CRUD operations sync with Google Sheets via Google Sheets API.
- Reminders may optionally integrate with Google Calendar in the future.

---

## 6. Error Handling

- Standard HTTP status codes.
- Error responses:
  ```json
  {
    "error": "Invalid request",
    "details": "Description of the error"
  }
  ```

---

## 7. Future Enhancements

- AI-powered analytics and recommendations.
- Automated data extraction from job links.
- Google Calendar integration for reminders.
- Support for multiple storage backends.

---

## 8. Implementation Guidance

### 8.1 Google Sheets Schema

**Applications Tab**

| Column           | Type    | Example                |
|------------------|---------|------------------------|
| id               | string  | "app_123"              |
| company          | string  | "Acme Corp"            |
| job_title        | string  | "Software Engineer"    |
| location         | string  | "Remote"               |
| description      | string  | "Frontend role"        |
| link             | string  | "https://example.com"  |
| contact          | string  | "recruiter@email.com"  |
| referral         | string  | "Jane Doe"             |
| date_applied     | string  | "2025-07-01"           |
| status           | string  | "applied"              |
| favorite         | boolean | true                   |

Example header row:  
`id,company,job_title,location,description,link,contact,referral,date_applied,status,favorite`

**Reminders Tab**

| Column           | Type    | Example                |
|------------------|---------|------------------------|
| id               | string  | "rem_001"              |
| application_id   | string  | "app_123"              |
| reminder_date    | string  | "2025-07-10"           |
| note             | string  | "Follow up email"      |

Example header row:  
`id,application_id,reminder_date,note`

---

### 8.2 OAuth Flow Implementation

- Use Google OAuth 2.0 for authentication.
- Required scopes:  
  - `https://www.googleapis.com/auth/spreadsheets`
  - `https://www.googleapis.com/auth/drive`
- Steps:
  1. Redirect user to Google OAuth consent screen.
  2. Receive authorization code and exchange for access/refresh tokens.
  3. Store tokens securely (e.g., encrypted in DB or in-memory for session).
  4. Use access token for Google Sheets API calls; refresh as needed.
- Reference: [Google Identity Platform Docs](https://developers.google.com/identity)

---

### 8.3 Business Logic Examples

**Add Application (Create Row):**
- Use Sheets API `spreadsheets.values.append` to add a new row to "Applications" tab.

**Find by ID (Read Row):**
- Use `spreadsheets.values.get` to read all rows, then filter by `id`.

**Update Application:**
- Find row index by `id`, then use `spreadsheets.values.update` for that row.

**Delete Application:**
- Find row index by `id`, then use `spreadsheets.batchUpdate` to delete the row.

---

### 8.4 Analytics Calculation

- **Total Applications:** Count rows in "Applications" tab.
- **Response Rate:** Count rows with status != "applied" or "pending" / total applications.
- **Interview Rate:** Count rows with status == "interview" / total applications.
- **Top Companies:** Group by `company`, count, and sort descending.
- Compute analytics on-the-fly from sheet data.

---

### 8.5 Error Response Examples

- **Permission Denied:**  
  `403 Forbidden`  
  ```json
  { "error": "Permission denied", "details": "Google Sheets access not granted" }
  ```
- **Sheet Not Found:**  
  `404 Not Found`  
  ```json
  { "error": "Sheet not found", "details": "No sheet for user" }
  ```
- **Quota Exceeded:**  
  `429 Too Many Requests`  
  ```json
  { "error": "Quota exceeded", "details": "Google API rate limit reached" }
  ```

---

### 8.6 Security Practices

- Validate and sanitize all user input.
- Use environment variables for secrets and API keys.
- Handle concurrent writes with retries or row versioning.
- Never log sensitive tokens or user data.

---

### 8.7 Environment/Stack Guidance

- **Recommended Stack:** Node.js with Express, or Python with FastAPI.
- **Google API Client Libraries:**  
  - [Node.js](https://github.com/googleapis/google-api-nodejs-client)
  - [Python](https://github.com/googleapis/google-api-python-client)
- **Sample Project Structure:**
  ```
  /src
    /routes
    /services
    /utils
    /models
    app.js (or main.py)
  ```

---

## 9. Advanced Implementation Details

### 9.1 Sheet Initialization Logic

**Pseudocode for Sheet Creation:**
```js
// Node.js example using googleapis
const { google } = require('googleapis');
const sheets = google.sheets('v4');

// 1. Create the spreadsheet
const spreadsheet = await sheets.spreadsheets.create({
  resource: {
    properties: { title: 'Job_Tracker' },
    sheets: [
      { properties: { title: 'Applications' } },
      { properties: { title: 'Reminders' } }
    ]
  }
});

// 2. Write header rows
await sheets.spreadsheets.values.update({
  spreadsheetId: spreadsheet.data.spreadsheetId,
  range: 'Applications!A1:K1',
  valueInputOption: 'RAW',
  resource: { values: [[
    'id','company','job_title','location','description','link','contact','referral','date_applied','status','favorite'
  ]] }
});
await sheets.spreadsheets.values.update({
  spreadsheetId: spreadsheet.data.spreadsheetId,
  range: 'Reminders!A1:D1',
  valueInputOption: 'RAW',
  resource: { values: [[
    'id','application_id','reminder_date','note'
  ]] }
});
```

### 9.2 ID Generation

- Generate unique IDs for applications and reminders using a UUID library (e.g., `uuid` in Node.js or Python).
- IDs should be generated server-side before inserting new rows into the sheet.

### 9.3 Pagination and Filtering

- Support query parameters for `GET /applications`:
  - `page` (default: 1)
  - `limit` (default: 20)
  - `status` (optional, filter by status)
  - `sort` (optional, e.g., `date_applied`)
- Example:  
  `GET /applications?page=2&limit=10&status=applied&sort=date_applied`
- Implementation: Fetch all rows, then filter, sort, and slice in memory before returning the response.

### 9.4 Rate Limiting Strategy

- Use exponential backoff and retries for handling Google API rate limits.
- Example pseudocode:
```js
async function withRetry(apiCall, retries = 5) {
  let delay = 500;
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (err) {
      if (err.code === 429 && i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw err;
      }
    }
  }
}
```
- Reference: [Google API Error Handling](https://cloud.google.com/apis/design/errors#handling_errors)

### 9.5 Testing Guidance

- Use dependency injection to mock Google Sheets API calls in unit tests.
- Recommended libraries:
  - Node.js: [`nock`](https://github.com/nock/nock)
  - Python: [`responses`](https://github.com/getsentry/responses)
- For integration tests, use a dedicated test Google Sheet and clean up data after tests.
