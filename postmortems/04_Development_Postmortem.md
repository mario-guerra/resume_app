# Project Post-Mortem: Job Application Tracker Backend/API

## Overview

This document is a comprehensive post-mortem of the development, debugging, and architectural decisions made during the creation and testing of the Job Application Tracker backend. It includes all user prompts verbatim and summarizes the assistant's responses and actions for each, providing a detailed record for future reference.

---

## User Prompts and Summaries

### 1. **Prompt:**  
"evaluate this project and develop a comprehensive plan for completing the work, with the goal of running a functioning backend that we can test via interacting directly with the API using tools like Thunderbird client or Postman."

**Summary:**  
Assistant evaluated the project, identified missing Google Sheets integration, error handling, and testing. Provided a step-by-step plan to implement CRUD, analytics, OAuth, and documentation for API testing.

---

### 2. **Prompt:**  
"execute the plan"

**Summary:**  
Assistant began implementing the plan, starting with Google Sheets integration, updating route signatures to require a sheetId, and scaffolding CRUD and analytics endpoints.

---

### 3. **Prompt:**  
"how can I test it using a tool like thunderbird client or postman?"

**Summary:**  
Assistant explained how to use Postman to test the API, including authentication, JWT usage, and endpoint testing, noting that only some endpoints would work until Google Sheets logic was implemented.

---

### 4. **Prompt:**  
"why is the Google Sheets logic not yet implemented? What else is not yet done?"

**Summary:**  
Assistant clarified that Google Sheets logic was still a placeholder and listed other missing items: CRUD implementation, analytics, token refresh, and tests.

---

### 5. **Prompt:**  
"Put yourself in the role of a senior software architect. What would you suggest?" (regarding storing sheetId)

**Summary:**  
Assistant recommended storing the sheetId in a backend database mapped to user ID for security and scalability, but adapted to the user's constraint of no backend DB by suggesting the client provide the sheetId with each request.

---

### 6. **Prompt:**  
"We have no backend database to store the info, we are relying entirely on the user's Google account to  map them to their own Google Sheet."

**Summary:**  
Assistant confirmed the approach: the client must provide the sheetId with each request, and the backend will use it to access the correct sheet.

---

### 7. **Prompt:**  
"Review the architecture. If the implementation requires the app to have these values, and I believe it does, then it is not architected securely and needs to be corrected. you will correct the architecture as a principal software architect."

**Summary:**  
Assistant reviewed and corrected the architecture, ensuring that Google OAuth credentials are only on the backend, and the mobile app never receives them. Outlined the secure OAuth2 flow.

---

### 8. **Prompt:**  
"I can now successfully authenticate and I receive the following response, what am I supposed to do with it?" (with JWT and user info)

**Summary:**  
Assistant explained how to use the JWT for authenticated API requests, how to initialize the sheet, and how to use returned IDs for subsequent requests.

---

### 9. **Prompt:**  
"Generate a series of curl commands I can use to test the backend workflow using this JWT. Output them all as single-line commands. Create a new file for the workflow test and place it in the the 'test' directory at the root of the repo:"

**Summary:**  
Assistant generated a shell script with curl commands for the full workflow, using the provided JWT and placeholders for IDs.

---

### 10. **Prompt:**  
"I need the responses processed so I don't have to manually keep track of things like spreadsheet ID. Rewrite this test file in Python, as a test harness that will run through the entire workflow. The test harness should validate responses and retrieve response info required for subsequent requests, such as the spreadsheet id."

**Summary:**  
Assistant wrote a Python test harness that runs the workflow, validates responses, and automatically extracts IDs for subsequent requests.

---

### 11. **Prompt:**  
"Runtime error, please fix: ... AssertionError: Expected 201, got 500"

**Summary:**  
Assistant diagnosed the error as likely due to expired or invalid Google tokens in the JWT, and advised re-authenticating.

---

### 12. **Prompt:**  
"The health check passed, which would indicate the JWT is valid, no?"

**Summary:**  
Assistant clarified that the health check endpoint does not require authentication, so a valid JWT is not needed for that endpoint.

---

### 13. **Prompt:**  
"based on the JWT response I shared with you earlier, what was the expiration date/time of the JWT? Please explain the format to me."

**Summary:**  
Assistant decoded the JWT "exp" field, explained Unix timestamps, and provided the exact expiration time in UTC.

---

### 14. **Prompt:**  
"It's currently 1:20 PM CDT in my location, is this past the expiration time?"

**Summary:**  
Assistant confirmed that 1:20 PM CDT is after the JWT's expiration time, so the JWT is expired.

---

### 15. **Prompt:**  
"Is it possible to set the duration of the JWT I received for a Google OAuth request?"

**Summary:**  
Assistant explained that the backend can set the JWT duration via the `expiresIn` option in the JWT creation code, but Google access tokens have their own expiration.

---

### 16. **Prompt:**  
"I've regenerated the JWT, and now when I run the test script I get absolutely no output. Nothing. Nada. Zip. Zilch. Is this expected? How do I know if it's working?"

**Summary:**  
Assistant explained that this is not expected, suggested running with unbuffered output, and checking for errors or early exits.

---

### 17. **Prompt:**  
"Create a gitignore file for this repo that excludes the .env file, node_modules, and any other transitory content."

**Summary:**  
Assistant created a .gitignore file excluding .env, node_modules, logs, test artifacts, editor folders, and other transitory content.

---

### 18. **Prompt:**  
"add the 'venv' folder since this is the local python environment, or do we want to check that in as well?"

**Summary:**  
Assistant updated .gitignore to exclude the venv folder, explaining that local virtual environments should not be checked in.

---

### 19. **Prompt:**  
"I would now like you to review our entire chat history and write up a post-mortem of all the work we did. Include all of my prompts verbatim, along with a summary of your response to each prompt. Write it to a new file in the root of the repo. Be thorough in your writeup, we will need this info for posterity."

**Summary:**  
This document is the result: a thorough post-mortem with all prompts and summaries.

---

## Lessons Learned

- **OAuth2 Security:** Credentials must always be kept on the backend; never expose client secrets to the client/mobile app.
- **Token Expiry:** JWT and Google tokens expire; always check and refresh as needed.
- **Testing:** Automated test harnesses and scripts greatly improve workflow validation and reduce manual errors.
- **Minimal Permissions:** Always use the least privilege principle for OAuth scopes to improve user trust and security.
- **Documentation:** Clear documentation and post-mortems are invaluable for onboarding, debugging, and future development.

---

## Conclusion

This post-mortem captures the full development and debugging journey for the Job Application Tracker backend, including architectural decisions, security best practices, and workflow automation. It serves as a reference for future maintenance and development.
