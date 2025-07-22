# Product Requirements Document (PRD)
## Job Application Tracker Mobile App

---

### 1. Executive Summary / Purpose
A mobile-first application to help job seekers efficiently track job applications, statuses, and outcomes, leveraging Google Sheets/Drive for storage and Google authentication. The app aims to provide actionable insights, streamline job tracking, and support data-driven decision-making for users.

---

### 2. Problem Statement
Job seekers often lose track of applications, statuses, and follow-ups, especially when applying to many positions. Existing solutions are fragmented, require manual entry, or lack actionable analytics. There is a need for a simple, mobile, integrated tool to organize, track, and analyze job search activities.

---

### 3. Goals & Objectives
- Enable users to quickly log and track job applications on the go.
- Integrate with Google Sheets/Drive for seamless data storage and access.
- Provide reminders and status tracking for follow-ups.
- Offer data-driven insights (e.g., response rates, best-fit roles).
- Support a minimal, intuitive MVP with room for future enhancements (e.g., AI features).

---

### 4. Stakeholders
- Primary Users: Job seekers, career changers.
- Product Owners: Project initiators (Mario, Hector, etc.).
- Developers: App and backend/API developers.
- Future: Community contributors, potential employers.

---

### 5. User Personas
- **Active Job Seeker:** Applies to multiple jobs weekly, values organization and reminders.
- **Career Changer:** Exploring new fields, needs to track diverse applications and outcomes.
- **Referral Networker:** Relies on contacts and referrals, needs to log sources and follow-ups.

---

### 6. User Stories / User Journey
- As a user, I want to log in with my Google account.
- As a user, I want to add a new job prospect with details (company, title, location, link, contact, referral, date, etc.).
- As a user, I want to track the status of each application (applied, pending, rejected, interview, offer, etc.).
- As a user, I want to set reminders for follow-ups.
- As a user, I want to view analytics (e.g., number of applications, response rates, top companies).
- As a user, I want to favorite or group jobs for quick access.

---

### 7. Product Scope

#### MVP
- Mobile app (Android/iOS) with Google authentication.
- Add/view/edit job applications.
- Store data in Google Sheets (user’s Drive).
- Basic status tracking and reminders.
- Simple analytics (counts, response rates).
- Minimal, clean UI (cards, filters, favorites).

#### Future Enhancements
- AI-powered resume/job matching and recommendations.
- Automated data extraction from job links.
- Integration with Google Calendar for reminders.
- Advanced analytics and visualizations.
- Support for multiple storage backends.

---

### 8. Features & Requirements

#### Functional
- Google login/authentication.
- Add/edit/delete job entries.
- Fields: Company, job title, location, description, link, contact, referral, date, status, favorite.
- Status workflow: Applied, pending, contacted, interview, rejected, closed.
- Reminders for follow-up.
- Analytics dashboard (basic).
- Data sync with Google Sheets.

#### Non-functional
- Mobile-first, responsive design.
- Secure authentication and data handling.
- Minimal dependencies for MVP.
- Scalable architecture for future features.

---

### 9. UX/UI Considerations
- Card-based layout for job entries.
- Filters/grouping (by company, status, date, etc.).
- Favorites for quick access.
- Minimal screens: login, add prospect, list/status, analytics.
- Clean, intuitive navigation.
- Support for both manual entry and (future) automated data input.

---

### 10. Technical Architecture Overview
- Mobile app (React Native or similar).
- Google OAuth for authentication.
- Google Sheets API for data storage.
- Optional: Google Drive for resume storage.
- Modular design for future backend/API integration.
- (Future) AI integration via Gemini or similar.

---

### 11. Data & Analytics Requirements
- Track applications, statuses, outcomes.
- Calculate response rates, interview rates, etc.
- Identify trends (e.g., best-fit roles, top companies).
- Support export/sharing of data.

---

### 12. Success Metrics / KPIs
- Number of active users.
- Number of applications tracked per user.
- User retention and engagement rates.
- User-reported satisfaction and productivity.
- Number of reminders/actions completed.

---

### 13. Out of Scope (MVP)
- Full resume parsing or job scraping.
- Non-Google storage backends.
- Advanced AI features (beyond basic analytics).
- Multi-user collaboration.

---

### 14. Open Questions & Risks
- How to handle users without Google accounts?
- Privacy and data security for sensitive job search data.
- Scalability of Google Sheets for heavy users.
- Complexity of future AI/data extraction features.
- Support for non-English/localized versions.

---

### 15. Appendix
- Reference: planning/transcript.md (meeting transcript)
- Early UI sketches (to be added)
- Links to relevant APIs and documentation

---
