# Job Application Tracker Frontend

A modern React/Next.js frontend for the Job Application Tracker web application. Built with Next.js 14+, TypeScript, Tailwind CSS, and Shadcn/ui components.

## Features

- 🔐 Google OAuth authentication with NextAuth.js
- 📱 Responsive design optimized for mobile and desktop
- 🎨 Modern UI with Tailwind CSS and Shadcn/ui components
- 📊 Analytics dashboard with interactive charts
- 🔔 Smart reminders for job applications
- 🔍 Advanced search and filtering capabilities
- ⚡ Optimized performance with React Query and Zustand
- 🧪 Comprehensive testing setup with Vitest and Playwright

## Tech Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** Shadcn/ui
- **State Management:** Zustand + React Query
- **Authentication:** NextAuth.js
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library + Playwright

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see main project README)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env.local
```

3. Update environment variables in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   ├── dashboard/           # Dashboard and main app routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # Shadcn/ui components
│   ├── forms/               # Form components
│   ├── charts/              # Chart components
│   ├── layout/              # Layout components
│   └── features/            # Feature-specific components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities and configurations
├── services/                # API service functions
├── stores/                  # Zustand stores
└── types/                   # TypeScript type definitions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## Contributing

1. Follow the existing code style and formatting
2. Run `npm run lint` and `npm run type-check` before committing
3. Write tests for new features
4. Update documentation as needed

## License

This project is part of the Job Application Tracker system.
