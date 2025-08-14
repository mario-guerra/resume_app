import { z } from 'zod'

export const applicationSchema = z.object({
  company: z.string().min(1, 'Company name is required').max(100),
  job_title: z.string().min(1, 'Job title is required').max(100),
  location: z.string().max(100).optional(),
  description: z.string().max(1000).optional(),
  link: z.string().url('Invalid URL').optional().or(z.literal('')),
  contact: z.string().email('Invalid email').optional().or(z.literal('')),
  referral: z.string().max(100).optional(),
  date_applied: z.string().datetime(),
  status: z.enum([
    'applied',
    'pending',
    'contacted',
    'interview',
    'rejected',
    'closed',
  ]),
  favorite: z.boolean().default(false),
})

export const reminderSchema = z.object({
  application_id: z.string().min(1, 'Application ID is required'),
  reminder_date: z.string().datetime('Invalid date format'),
  note: z.string().min(1, 'Note is required').max(500),
})

export const searchSchema = z.object({
  search: z.string().optional(),
  status: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
})

export type ApplicationFormData = z.infer<typeof applicationSchema>
export type ReminderFormData = z.infer<typeof reminderSchema>
export type SearchParams = z.infer<typeof searchSchema>
