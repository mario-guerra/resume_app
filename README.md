# Job Application Tracker Backend

A stateless REST API for managing job applications and reminders, using Google Sheets as the backend and Google OAuth for authentication.

## Features

- Google OAuth 2.0 authentication
- CRUD for job applications and reminders
- Analytics endpoints
- Input validation and security best practices
- Modular, testable Node.js/Express codebase

## Setup

1. Clone the repository.
2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file with:

   ```
   PORT=3000
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   JWT_SECRET=your-jwt-secret
   ```

4. Start the development server:

   ```
   npm run dev
   ```

## Authentication Flow (OAuth2 Best Practice)

- The mobile app or client never receives or stores the Google client ID or secret.
- To authenticate, the client opens the backend's `/auth/google` endpoint in a browser or webview.
- The backend (with credentials in its environment) redirects the user to Google's OAuth consent screen.
- After authentication, Google redirects back to `/auth/callback` on the backend.
- The backend exchanges the code for tokens, issues a JWT, and returns it to the client.
- The client uses the JWT as a Bearer token for all subsequent API requests.

## API Endpoints

- `GET /health` – Health check
- `GET /auth/google` – Initiate Google OAuth (client opens this URL)
- `GET /auth/callback` – Handle OAuth callback (backend only)
- `POST /sheets/init` – Initialize user sheet (auth required)
- `GET/POST/PUT/DELETE /applications` – Manage job applications (auth required)
- `GET/POST/PUT/DELETE /reminders` – Manage reminders (auth required)
- `GET /analytics/summary` – Analytics summary (auth required)
- `GET /analytics/trends` – Analytics trends (auth required)

## Development

- Uses [nodemon](https://nodemon.io/) for hot-reloading in development.
- All code is in `/src` with modular structure for routes, services, models, and utils.
- Input validation via [joi](https://joi.dev/).
- Authentication via [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken).

## Testing

- Unit and integration tests recommended (see architecture docs for strategy).
- Use dependency injection/mocking for Google Sheets API.

## License

MIT
