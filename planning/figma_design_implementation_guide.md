# Figma Design Implementation Guide
## Job Search App - Web Implementation Instructions

### Overview
This document provides step-by-step instructions to implement the Figma design mockups as a responsive web application using React/Next.js. The design features a clean, card-based interface with job tracking, activity feeds, and note-taking capabilities.

---

## 1. Project Setup & Architecture

### 1.1 Initialize Next.js Project
```bash
# Create new Next.js project with TypeScript
npx create-next-app@latest job-tracker-web --typescript --tailwind --eslint --app

# Navigate to project directory
cd job-tracker-web

# Install additional dependencies
npm install @next-auth/prisma-adapter prisma @prisma/client
npm install @heroicons/react lucide-react
npm install @hookform/resolvers react-hook-form zod
npm install date-fns recharts
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install framer-motion
```

### 1.2 Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── activities/
│   │   │   └── page.tsx
│   │   └── notes/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts
│   │   ├── jobs/
│   │   │   └── route.ts
│   │   └── activities/
│   │       └── route.ts
│   ├── components/
│   │   ├── ui/
│   │   ├── layouts/
│   │   ├── forms/
│   │   └── cards/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
└── types/
    ├── job.ts
    ├── activity.ts
    └── user.ts
```

---

## 2. Design System Implementation

### 2.1 Color Palette & Typography
```css
/* globals.css - Based on Figma design */
:root {
  /* Primary Colors */
  --primary-50: #fef7ee;
  --primary-500: #f97316;
  --primary-600: #ea580c;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-400: #9ca3af;
  --gray-600: #4b5563;
  --gray-900: #111827;
  
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #3b82f6;
}

.card-shadow {
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
}

.card-hover {
  transition: all 0.2s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
```

### 2.2 Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          500: '#f97316',
          600: '#ea580c',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          400: '#9ca3af',
          600: '#4b5563',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
```

---

## 3. Screen-by-Screen Implementation

### 3.1 Authentication Screen (First Time Pages)
**File:** `src/app/(auth)/login/page.tsx`

```tsx
'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Job Search App
          </h1>
          <p className="text-gray-600">
            Track your job applications and stay organized
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              {/* Google Icon SVG */}
            </svg>
            {isLoading ? 'Signing in...' : 'Login using Google account'}
          </Button>
          
          <Button
            onClick={() => {/* Handle new job hunting */}}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white"
          >
            Start new job hunting
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

### 3.2 Dashboard/Landing Page
**File:** `src/app/(dashboard)/dashboard/page.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import { JobCard } from '@/components/cards/JobCard'
import { FilterButton } from '@/components/ui/FilterButton'
import { HistoryButton } from '@/components/ui/HistoryButton'
import { Job } from '@/types/job'

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState('all')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Job Search App
            </h1>
            <div className="flex items-center space-x-4">
              <HistoryButton />
              <FilterButton onFilterChange={setFilter} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        
        {jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                {/* Empty state icon */}
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No job applications yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by adding your first job application
            </p>
            <Button href="/jobs/new" className="bg-primary-500 hover:bg-primary-600">
              Add First Job
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
```

### 3.3 Job Card Component
**File:** `src/components/cards/JobCard.tsx`

```tsx
import { Job } from '@/types/job'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatDate } from '@/lib/utils'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow card-hover cursor-pointer">
      {/* Company Logo/Image */}
      <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {job.companyLogo ? (
          <img 
            src={job.companyLogo} 
            alt={job.company}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              {/* Building icon */}
            </svg>
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {job.title}
          </h3>
          <StatusBadge status={job.status} />
        </div>
        
        <p className="text-gray-600 text-sm">
          {job.company}
        </p>
        
        <p className="text-gray-500 text-xs">
          Applied {formatDate(job.appliedDate)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              {/* Heart icon */}
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              {/* Share icon */}
            </svg>
          </button>
        </div>
        
        <button className="text-primary-500 hover:text-primary-600 text-xs font-medium">
          View Details
        </button>
      </div>
    </div>
  )
}
```

### 3.4 New Job Form
**File:** `src/app/(dashboard)/jobs/new/page.tsx`

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'

const jobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().optional(),
  jobUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  contact: z.string().optional(),
  appliedDate: z.string(),
  favorite: z.boolean().default(false)
})

type JobFormData = z.infer<typeof jobSchema>

export default function NewJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      appliedDate: new Date().toISOString().split('T')[0]
    }
  })

  const onSubmit = async (data: JobFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error creating job:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              {/* Back arrow icon */}
            </svg>
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Prospect Jobs
          </h1>
        </div>

        {/* Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <Input
                {...register('company')}
                placeholder="Add company address"
                error={errors.company?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title
              </label>
              <Input
                {...register('title')}
                placeholder="Add job title"
                error={errors.title?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <Input
                {...register('location')}
                placeholder="Add location"
                error={errors.location?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description/Core Business
              </label>
              <Textarea
                {...register('description')}
                placeholder="Add description/core business"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link to Job
              </label>
              <Input
                {...register('jobUrl')}
                placeholder="Add link"
                type="url"
                error={errors.jobUrl?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact
              </label>
              <Input
                {...register('contact')}
                placeholder="Who told you/referred you"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <Input
                {...register('appliedDate')}
                type="date"
                error={errors.appliedDate?.message}
              />
            </div>

            <div className="flex items-center">
              <input
                {...register('favorite')}
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Top company you're interested in
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3"
            >
              {isLoading ? 'Adding...' : 'Add to drive'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
```

### 3.5 Activities Page
**File:** `src/app/(dashboard)/activities/page.tsx`

```tsx
'use client'

import { useState, useEffect } from 'react'
import { ActivityCard } from '@/components/cards/ActivityCard'
import { FilterTabs } from '@/components/ui/FilterTabs'
import { Activity } from '@/types/activity'

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeFilter, setActiveFilter] = useState('Company')

  const filterOptions = ['Company', 'Favorite', 'Category', 'Category']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Activity
          </h1>
          
          {/* Filter Tabs */}
          <FilterTabs
            options={filterOptions}
            active={activeFilter}
            onChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Activities List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-xl p-6 card-shadow">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Jobs Applied</div>
              <div className="text-xs text-gray-500"># from database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">3</div>
              <div className="text-sm text-gray-600"># pending</div>
              <div className="text-xs text-gray-500"># from database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2</div>
              <div className="text-sm text-gray-600">Rejected/closed</div>
              <div className="text-xs text-gray-500"># from database</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">$21.98</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

### 3.6 Notes/Chat Interface
**File:** `src/app/(dashboard)/notes/page.tsx`

```tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  content: string
  timestamp: Date
  isUser: boolean
}

export default function NotesPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'This is the main chat template',
      timestamp: new Date(),
      isUser: false
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      isUser: true
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
          <div>
            <h2 className="font-semibold text-gray-900">Helena Hills</h2>
            <p className="text-sm text-gray-500">Active 20m ago</p>
          </div>
          <div className="ml-auto flex space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {/* Phone icon */}
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {/* Video icon */}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isUser
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.isUser ? 'text-primary-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {/* Microphone icon */}
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              {/* Camera icon */}
            </svg>
          </button>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="bg-primary-500 hover:bg-primary-600"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
```

---

## 4. Layout & Navigation

### 4.1 Main Layout with Bottom Navigation
**File:** `src/app/(dashboard)/layout.tsx`

```tsx
'use client'

import { BottomNavigation } from '@/components/layouts/BottomNavigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-20">
        {children}
      </main>
      <BottomNavigation />
    </div>
  )
}
```

### 4.2 Bottom Navigation Component
**File:** `src/components/layouts/BottomNavigation.tsx`

```tsx
'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon, 
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  BellIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleIconSolid,
  ShoppingCartIcon as ShoppingCartIconSolid,
  BellIcon as BellIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon, iconSolid: HomeIconSolid },
  { name: 'Help', href: '/help', icon: QuestionMarkCircleIcon, iconSolid: QuestionMarkCircleIconSolid },
  { name: 'Cart', href: '/cart', icon: ShoppingCartIcon, iconSolid: ShoppingCartIconSolid },
  { name: 'Notifications', href: '/activities', icon: BellIcon, iconSolid: BellIconSolid },
  { name: 'Profile', href: '/profile', icon: UserIcon, iconSolid: UserIconSolid },
]

export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const Icon = isActive ? item.iconSolid : item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

---

## 5. UI Components Library

### 5.1 Button Component
**File:** `src/components/ui/button.tsx`

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', href, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
    
    const variants = {
      default: 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500',
      outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
      ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500'
    }
    
    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    }

    if (href) {
      return (
        <a
          href={href}
          className={cn(baseClasses, variants[variant], sizes[size], className)}
        >
          {props.children}
        </a>
      )
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }
```

### 5.2 Input Component
**File:** `src/components/ui/input.tsx`

```tsx
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div>
        <input
          className={cn(
            'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
```

### 5.3 Status Badge Component
**File:** `src/components/ui/StatusBadge.tsx`

```tsx
interface StatusBadgeProps {
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending'
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants = {
    applied: 'bg-blue-100 text-blue-800',
    interview: 'bg-yellow-100 text-yellow-800',
    offer: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    pending: 'bg-gray-100 text-gray-800'
  }

  const labels = {
    applied: 'Applied',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    pending: 'Pending'
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}>
      {labels[status]}
    </span>
  )
}
```

---

## 6. Data Models & Types

### 6.1 Job Type Definition
**File:** `src/types/job.ts`

```typescript
export interface Job {
  id: string
  title: string
  company: string
  location: string
  description?: string
  jobUrl?: string
  contact?: string
  appliedDate: Date
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'pending'
  favorite: boolean
  companyLogo?: string
  salary?: {
    min: number
    max: number
    currency: string
  }
  notes: string[]
  activities: Activity[]
  createdAt: Date
  updatedAt: Date
}

export interface JobFormData {
  title: string
  company: string
  location: string
  description?: string
  jobUrl?: string
  contact?: string
  appliedDate: string
  favorite: boolean
}
```

### 6.2 Activity Type Definition
**File:** `src/types/activity.ts`

```typescript
export interface Activity {
  id: string
  jobId: string
  type: 'application' | 'interview' | 'rejection' | 'offer' | 'follow_up' | 'note'
  title: string
  description?: string
  timestamp: Date
  user: {
    id: string
    name: string
    avatar?: string
  }
  metadata?: {
    interviewType?: 'phone' | 'video' | 'in_person'
    interviewDate?: Date
    rejectionReason?: string
    offerAmount?: number
    followUpDate?: Date
  }
}
```

---

## 7. API Routes

### 7.1 Jobs API Route
**File:** `src/app/api/jobs/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(jobs)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const job = await prisma.job.create({
      data: {
        ...data,
        userId: session.user.id,
        appliedDate: new Date(data.appliedDate)
      }
    })
    
    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 })
  }
}
```

---

## 8. Responsive Design Implementation

### 8.1 Mobile-First Approach
```css
/* Mobile First (320px+) */
.container {
  padding: 1rem;
}

.grid {
  grid-template-columns: 1fr;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
  
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 8.2 Responsive Navigation
- **Mobile:** Bottom tab navigation (as shown in Figma)
- **Tablet:** Bottom navigation with larger icons
- **Desktop:** Side navigation or top navigation bar

---

## 9. Performance Optimization

### 9.1 Image Optimization
```typescript
// Use Next.js Image component for company logos
import Image from 'next/image'

<Image
  src={job.companyLogo || '/placeholder-company.png'}
  alt={job.company}
  width={128}
  height={128}
  className="rounded-lg object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### 9.2 Code Splitting & Lazy Loading
```typescript
// Lazy load heavy components
import dynamic from 'next/dynamic'

const AnalyticsChart = dynamic(() => import('@/components/AnalyticsChart'), {
  loading: () => <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />
})
```

---

## 10. Testing Strategy

### 10.1 Component Testing
```typescript
// JobCard.test.tsx
import { render, screen } from '@testing-library/react'
import { JobCard } from '@/components/cards/JobCard'

const mockJob = {
  id: '1',
  title: 'Frontend Developer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  status: 'applied' as const,
  appliedDate: new Date(),
  favorite: false
}

test('renders job card with correct information', () => {
  render(<JobCard job={mockJob} />)
  
  expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  expect(screen.getByText('Tech Corp')).toBeInTheDocument()
  expect(screen.getByText('Applied')).toBeInTheDocument()
})
```

### 10.2 API Testing
```typescript
// jobs.test.ts
import { GET, POST } from '@/app/api/jobs/route'
import { NextRequest } from 'next/server'

test('GET /api/jobs returns user jobs', async () => {
  const request = new NextRequest('http://localhost:3000/api/jobs')
  const response = await GET(request)
  
  expect(response.status).toBe(200)
})
```

---

## 11. Deployment Instructions

### 11.1 Environment Variables
```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=postgresql://username:password@localhost:5432/jobtracker
```

### 11.2 Build & Deploy
```bash
# Build for production
npm run build

# Deploy to Vercel
npx vercel --prod

# Or deploy to other platforms
npm run start
```

---

## 12. Development Timeline

### Phase 1: Foundation (Week 1-2)
- [ ] Next.js project setup with TypeScript
- [ ] Authentication with Google OAuth
- [ ] Basic layout and navigation
- [ ] Database schema and API routes
- [ ] Job CRUD operations

### Phase 2: Core Features (Week 3-4)
- [ ] Job cards and listing page
- [ ] Job application form
- [ ] Status management
- [ ] Activities feed
- [ ] Basic filtering and search

### Phase 3: Enhanced Features (Week 5-6)
- [ ] Notes/chat interface
- [ ] Analytics dashboard
- [ ] Advanced filtering
- [ ] Data export
- [ ] Performance optimization

### Phase 4: Polish & Launch (Week 7-8)
- [ ] Responsive design refinement
- [ ] Testing and bug fixes
- [ ] Deployment setup
- [ ] Documentation

---

## 13. Success Metrics

### 13.1 User Experience Metrics
- **Page Load Time:** < 2 seconds
- **Mobile Responsiveness:** 100% viewport compatibility
- **Accessibility Score:** 95+ (WCAG 2.1 AA)
- **User Task Completion:** 90%+ for core flows

### 13.2 Technical Metrics
- **Core Web Vitals:** All metrics in green
- **Test Coverage:** 80%+ for critical components
- **Bundle Size:** < 500KB initial load
- **API Response Time:** < 500ms average

---

This implementation guide provides a complete roadmap for building the job search application shown in your Figma designs. The structure follows modern React/Next.js best practices while maintaining the clean, card-based design aesthetic from your mockups.

The implementation prioritizes:
1. **Mobile-first responsive design**
2. **Clean component architecture**
3. **Type-safe development with TypeScript**
4. **Performance optimization**
5. **Comprehensive testing**
6. **Easy deployment and maintenance**

Would you like me to elaborate on any specific section or help you get started with the initial setup?
