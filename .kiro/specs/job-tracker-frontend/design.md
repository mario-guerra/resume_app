# Design Document: Job Application Tracker Frontend

## Overview

This design document outlines the architecture and implementation approach for a modern React/Next.js frontend for the Job Application Tracker. The frontend will provide a responsive, performant web application that integrates seamlessly with the existing Express.js backend and Google Sheets data store.

The application will be built using Next.js 14+ with the App Router, TypeScript for type safety, Tailwind CSS for styling, Shadcn/ui for consistent components, and modern state management patterns for optimal user experience.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 14+)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │   Pages     │  │ Components  │  │   Hooks     │       │
│  │ (App Router)│  │   (UI)      │  │ (Business)  │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │    State    │  │  Services   │  │   Utils     │       │
│  │  (Zustand)  │  │(React Query)│  │ (Helpers)   │       │
│  └─────────────┘  └─────────────┘  └─────────────┘       │
└─────────────────────────────────────────────────────────────┘
                              │
                         HTTP/HTTPS
                              │
┌─────────────────────────────────────────────────────────────┐
│                 EXISTING BACKEND (Express.js)              │
│                    (Google Sheets API)                     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS with Shadcn/ui components
- **State Management:** Zustand for global state + React Query for server state
- **Authentication:** NextAuth.js with Google OAuth
- **Charts:** Recharts for analytics visualization
- **Forms:** React Hook Form with Zod validation
- **HTTP Client:** Axios with interceptors
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel

## Components and Interfaces

### Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── applications/
│   │   │   ├── page.tsx      # Applications list
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Application details
│   │   ├── analytics/
│   │   │   └── page.tsx      # Analytics dashboard
│   │   └── reminders/
│   │       └── page.tsx      # Reminders management
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   ├── loading.tsx           # Global loading UI
│   ├── error.tsx             # Global error UI
│   └── globals.css
├── components/
│   ├── ui/                   # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── ApplicationForm.tsx
│   │   ├── ReminderForm.tsx
│   │   └── SearchForm.tsx
│   ├── charts/
│   │   ├── ApplicationTrends.tsx
│   │   ├── StatusDistribution.tsx
│   │   └── ResponseRateChart.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Footer.tsx
│   └── features/
│       ├── applications/
│       │   ├── ApplicationsList.tsx
│       │   ├── ApplicationCard.tsx
│       │   ├── ApplicationFilters.tsx
│       │   └── ApplicationStats.tsx
│       ├── reminders/
│       │   ├── RemindersList.tsx
│       │   └── ReminderCard.tsx
│       └── analytics/
│           ├── AnalyticsDashboard.tsx
│           └── MetricsCards.tsx
├── hooks/
│   ├── useApplications.ts
│   ├── useReminders.ts
│   ├── useAnalytics.ts
│   ├── useAuth.ts
│   └── useLocalStorage.ts
├── lib/
│   ├── auth.ts               # NextAuth configuration
│   ├── api.ts                # API client setup
│   ├── utils.ts              # Utility functions
│   ├── validations.ts        # Zod schemas
│   └── constants.ts
├── services/
│   ├── applications.ts       # Application API calls
│   ├── reminders.ts          # Reminder API calls
│   ├── analytics.ts          # Analytics API calls
│   └── auth.ts               # Authentication services
├── stores/
│   ├── useApplicationStore.ts
│   ├── useUIStore.ts
│   └── useUserStore.ts
└── types/
    ├── application.ts
    ├── reminder.ts
    ├── analytics.ts
    └── api.ts
```

### Core Components Design

#### Authentication Flow
- **NextAuth.js Integration:** Seamless Google OAuth with session management
- **Protected Routes:** Middleware-based route protection
- **Session Persistence:** Secure token storage and refresh

#### Application Management
- **ApplicationsList:** Virtualized table for performance with large datasets
- **ApplicationForm:** Comprehensive form with validation and optimistic updates
- **ApplicationFilters:** Real-time search and filtering with debounced input
- **ApplicationStats:** Live statistics with animated counters

#### Analytics Dashboard
- **Interactive Charts:** Responsive charts using Recharts library
- **Metric Cards:** Key performance indicators with trend indicators
- **Date Range Picker:** Flexible time period selection for analytics

#### Responsive Design
- **Mobile-First Approach:** Progressive enhancement for larger screens
- **Adaptive Navigation:** Collapsible sidebar on desktop, bottom navigation on mobile
- **Touch-Friendly UI:** Appropriate touch targets and gestures

## Data Models

### TypeScript Interfaces

```typescript
// Application Data Model
interface JobApplication {
  id: string
  company: string
  job_title: string
  location?: string
  description?: string
  link?: string
  contact?: string
  referral?: string
  date_applied: string // ISO8601
  status: 'applied' | 'pending' | 'contacted' | 'interview' | 'rejected' | 'closed'
  favorite: boolean
}

// Reminder Data Model
interface Reminder {
  id: string
  application_id: string
  reminder_date: string // ISO8601
  note: string
}

// Analytics Data Models
interface AnalyticsSummary {
  total_applications: number
  response_rate: number
  interview_rate: number
  top_companies: string[]
}

interface AnalyticsTrends {
  top_roles: string[]
  top_companies: string[]
  application_trends: Array<{
    month: string
    count: number
  }>
}

// UI State Models
interface FilterState {
  search: string
  status: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface UIState {
  sidebarOpen: boolean
  currentView: 'dashboard' | 'applications' | 'analytics' | 'reminders'
  loading: boolean
  error: string | null
}
```

### State Management Architecture

#### Zustand Stores

```typescript
// Application Store
interface ApplicationStore {
  applications: JobApplication[]
  filters: FilterState
  selectedApplication: JobApplication | null
  
  // Actions
  setApplications: (applications: JobApplication[]) => void
  addApplication: (application: JobApplication) => void
  updateApplication: (id: string, updates: Partial<JobApplication>) => void
  removeApplication: (id: string) => void
  setFilters: (filters: Partial<FilterState>) => void
  setSelectedApplication: (application: JobApplication | null) => void
}

// UI Store
interface UIStore {
  sidebarOpen: boolean
  currentView: string
  loading: boolean
  error: string | null
  
  // Actions
  toggleSidebar: () => void
  setCurrentView: (view: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}
```

#### React Query Integration

```typescript
// Custom hooks for server state management
export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: () => applicationService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  })
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: applicationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['applications'])
      queryClient.invalidateQueries(['analytics'])
    },
    onMutate: async (newApplication) => {
      // Optimistic update
      await queryClient.cancelQueries(['applications'])
      const previousApplications = queryClient.getQueryData(['applications'])
      
      queryClient.setQueryData(['applications'], (old: JobApplication[]) => [
        ...old,
        { ...newApplication, id: `temp-${Date.now()}` }
      ])
      
      return { previousApplications }
    },
    onError: (err, newApplication, context) => {
      // Rollback on error
      queryClient.setQueryData(['applications'], context?.previousApplications)
    }
  })
}
```

## Error Handling

### Error Boundary Strategy

```typescript
// Global Error Boundary
class GlobalErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Global error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}
```

### API Error Handling

```typescript
// API Client with Error Handling
class ApiClient {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      
      switch (response.status) {
        case 401:
          // Redirect to login
          window.location.href = '/login'
          throw new AuthError('Authentication required')
        case 403:
          throw new AuthError('Permission denied')
        case 404:
          throw new NotFoundError('Resource not found')
        case 429:
          throw new RateLimitError('Too many requests')
        case 500:
          throw new ServerError('Internal server error')
        default:
          throw new ApiError(errorData.error || 'Unknown error occurred')
      }
    }
    
    return response.json()
  }
}
```

### User-Friendly Error Messages

```typescript
// Error Message Mapping
const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect. Please check your internet connection.',
  AUTH_ERROR: 'Please sign in again to continue.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
  NOT_FOUND: 'The requested item could not be found.',
  RATE_LIMIT: 'Too many requests. Please wait a moment and try again.'
}

// Error Toast Component
const ErrorToast = ({ error }: { error: Error }) => {
  const message = ERROR_MESSAGES[error.type] || error.message
  
  return (
    <Toast variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <ToastTitle>Error</ToastTitle>
      <ToastDescription>{message}</ToastDescription>
    </Toast>
  )
}
```

## Testing Strategy

### Testing Pyramid

```
                    ┌─────────────┐
                    │   E2E (5%)  │
                    │ Playwright  │
                    └─────────────┘
              ┌───────────────────────────┐
              │    Integration (25%)      │
              │ React Testing Library     │
              └───────────────────────────┘
        ┌─────────────────────────────────────────┐
        │            Unit (70%)                   │
        │           Vitest                        │
        └─────────────────────────────────────────┘
```

### Unit Testing

```typescript
// Component Unit Test Example
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ApplicationForm } from '../ApplicationForm'

describe('ApplicationForm', () => {
  it('should validate required fields', async () => {
    const mockOnSubmit = vi.fn()
    render(<ApplicationForm onSubmit={mockOnSubmit} />)
    
    fireEvent.click(screen.getByText('Save Application'))
    
    await waitFor(() => {
      expect(screen.getByText('Company name is required')).toBeInTheDocument()
      expect(screen.getByText('Job title is required')).toBeInTheDocument()
    })
    
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should submit form with valid data', async () => {
    const mockOnSubmit = vi.fn()
    render(<ApplicationForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText('Company Name'), {
      target: { value: 'Google' }
    })
    fireEvent.change(screen.getByLabelText('Job Title'), {
      target: { value: 'Software Engineer' }
    })
    
    fireEvent.click(screen.getByText('Save Application'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        company: 'Google',
        job_title: 'Software Engineer',
        status: 'applied',
        favorite: false
      })
    })
  })
})
```

### Integration Testing

```typescript
// API Integration Test
import { server } from '../mocks/server'
import { rest } from 'msw'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApplications } from '../hooks/useApplications'

describe('useApplications Integration', () => {
  it('should fetch and return applications', async () => {
    const mockApplications = [
      { id: '1', company: 'Google', job_title: 'SWE', status: 'applied' }
    ]
    
    server.use(
      rest.get('/api/applications', (req, res, ctx) => {
        return res(ctx.json(mockApplications))
      })
    )
    
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } }
    })
    
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    )
    
    const { result } = renderHook(() => useApplications(), { wrapper })
    
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    
    expect(result.current.data).toEqual(mockApplications)
  })
})
```

### End-to-End Testing

```typescript
// E2E Test with Playwright
import { test, expect } from '@playwright/test'

test.describe('Job Application Tracker', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.goto('/dashboard')
  })

  test('should create new application', async ({ page }) => {
    await page.click('text=Add New Application')
    
    await page.fill('[data-testid=company-input]', 'Google')
    await page.fill('[data-testid=job-title-input]', 'Software Engineer')
    await page.selectOption('[data-testid=status-select]', 'applied')
    
    await page.click('text=Save Application')
    
    await expect(page.locator('text=Application saved successfully')).toBeVisible()
    await expect(page.locator('text=Google')).toBeVisible()
    await expect(page.locator('text=Software Engineer')).toBeVisible()
  })

  test('should filter applications by status', async ({ page }) => {
    await page.selectOption('[data-testid=status-filter]', 'interview')
    
    const applicationRows = page.locator('[data-testid=application-row]')
    await expect(applicationRows).toHaveCount(2) // Assuming 2 interview applications
    
    const statusCells = page.locator('[data-testid=status-cell]')
    await expect(statusCells.first()).toHaveText('interview')
  })
})
```

## Performance Optimization

### Code Splitting and Lazy Loading

```typescript
// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('../components/analytics/AnalyticsDashboard'))
const ApplicationForm = lazy(() => import('../components/forms/ApplicationForm'))

// Route-based code splitting with Next.js App Router is automatic
```

### Virtualization for Large Lists

```typescript
// Virtual scrolling for large application lists
import { FixedSizeList as List } from 'react-window'

const ApplicationsList = ({ applications }: { applications: JobApplication[] }) => {
  const Row = ({ index, style }: { index: number; style: CSSProperties }) => (
    <div style={style}>
      <ApplicationCard application={applications[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={applications.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  )
}
```

### Optimistic Updates

```typescript
// Optimistic updates for better UX
const useUpdateApplication = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: applicationService.update,
    onMutate: async ({ id, updates }) => {
      await queryClient.cancelQueries(['applications'])
      
      const previousApplications = queryClient.getQueryData(['applications'])
      
      queryClient.setQueryData(['applications'], (old: JobApplication[]) =>
        old.map(app => app.id === id ? { ...app, ...updates } : app)
      )
      
      return { previousApplications }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['applications'], context?.previousApplications)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['applications'])
    }
  })
}
```

### Caching Strategy

```typescript
// React Query configuration for optimal caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false
        return failureCount < 3
      }
    }
  }
})
```

## Security Considerations

### Authentication Security

```typescript
// Secure NextAuth.js configuration
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/spreadsheets'
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      return session
    }
  }
}
```

### Input Validation

```typescript
// Zod schemas for validation
export const applicationSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  job_title: z.string().min(1, 'Job title is required').max(100),
  location: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact: z.string().email('Invalid email').optional().or(z.literal('')),
  referral: z.string().max(100).optional(),
  date_applied: z.string().datetime(),
  status: z.enum(['applied', 'pending', 'contacted', 'interview', 'rejected', 'closed']),
  favorite: z.boolean()
})
```

### Content Security Policy

```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self' https://api.example.com",
              "font-src 'self'"
            ].join('; ')
          }
        ]
      }
    ]
  }
}
```

This design provides a comprehensive foundation for building a modern, performant, and secure job application tracker frontend that integrates seamlessly with the existing backend while providing an excellent user experience across all devices.