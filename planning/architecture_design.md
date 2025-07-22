# Architecture Design Document: Job Application Tracker

---

## 1. System Overview

The Job Application Tracker is a stateless REST API that enables users to manage job applications and reminders, with Google Sheets as the primary data store and Google OAuth for authentication. The system is designed for mobile-first clients and prioritizes user data isolation, security, and extensibility.

---

## 2. High-Level Architecture

**Components:**
- **API Server:** Stateless REST API (Node.js/Express or Python/FastAPI).
- **Google OAuth Integration:** Handles authentication and token management.
- **Google Sheets Service Layer:** Abstracts all CRUD operations and schema management.
- **Business Logic Layer:** Implements application/reminder/analytics logic, error handling, and data validation.
- **(Optional) Analytics Engine:** Computes stats and trends on-the-fly from sheet data.
- **Testing Layer:** Supports unit and integration testing with dependency injection/mocking.

**Deployment:**
- Containerized (Docker) for portability.
- Runs on cloud platforms (GCP, AWS, Azure) or serverless (Cloud Run, Lambda).

---

## 3. Data Flow

1. **Authentication:**  
   - User initiates OAuth flow (`/auth/google`).
   - API exchanges code for tokens, issues JWT/session.
   - All subsequent requests require Bearer token.

2. **Request Handling:**  
   - API validates JWT and scopes.
   - Routes request to appropriate controller (applications, reminders, analytics).
   - Controller invokes Google Sheets Service with user context.
   - Service performs CRUD via Google Sheets API, handling batching, retries, and errors.
   - Business logic layer processes data, applies filtering/pagination, and formats response.

3. **Response:**  
   - API returns HTTP response with data or error object.

---

## 4. Key Design Decisions

- **User Data Isolation:**  
  Each user has a dedicated Google Sheet or user-specific tabs. Sheet IDs are mapped to user IDs and stored securely (e.g., in a metadata DB or encrypted JWT claims).

- **Google Sheets as Source of Truth:**  
  All data operations are performed directly on Google Sheets. No intermediate caching to avoid sync issues.

- **Stateless API:**  
  No server-side session state; all user context is derived from JWT and tokens.

- **Error Handling:**  
  All Google API errors are mapped to standard HTTP responses. Exponential backoff and retries for rate limits.

- **Extensibility:**  
  Service and business logic layers are modular, enabling future support for new storage backends, analytics, or integrations (e.g., Google Calendar).

---

## 5. Security

- **OAuth 2.0:**  
  All endpoints (except `/auth/google` and `/auth/callback`) require a valid JWT.
- **Token Storage:**  
  Access/refresh tokens are stored securely (encrypted at rest, never logged).
- **Input Validation:**  
  All user input is validated and sanitized.
- **Least Privilege:**  
  Only required Google API scopes are requested.
- **Environment Variables:**  
  Secrets and API keys are managed via environment variables.

---

## 6. Performance & Scalability

- **Batching:**  
  Use Google Sheets API batch operations for reads/writes.
- **Retry Logic:**  
  Exponential backoff for rate limits and transient errors.
- **Pagination:**  
  All list endpoints support pagination and filtering in-memory after fetching rows.
- **Statelessness:**  
  Enables horizontal scaling behind a load balancer.

---

## 7. Extensibility

- **Pluggable Storage:**  
  Abstract data access to support future backends (e.g., SQL, NoSQL).
- **Analytics Module:**  
  Analytics logic is modular for future AI/ML enhancements.
- **Integration Hooks:**  
  Reminders logic is designed to support Google Calendar integration.

---

## 8. Project Structure

```
/src
  /routes         # API route handlers
  /services       # Google Sheets, OAuth, analytics, reminders
  /models         # Data models and validation
  /utils          # Helpers (ID generation, error mapping, etc.)
  app.js (or main.py)
```

---

## 9. Testing Strategy

- **Unit Tests:**  
  Mock Google Sheets API using dependency injection.
- **Integration Tests:**  
  Use a dedicated test sheet; clean up after tests.
- **Recommended Libraries:**  
  Node.js: Jest, nock. Python: pytest, responses.

---

## 10. Future Enhancements

- AI-powered analytics and recommendations.
- Automated data extraction from job links.
- Google Calendar integration for reminders.
- Support for multiple storage backends.

---

**Next Steps:**  
- Review this architecture with engineering and product teams.
- Begin implementation with a focus on modularity, security, and testability.
