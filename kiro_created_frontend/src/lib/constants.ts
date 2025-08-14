export const APPLICATION_STATUSES = [
  'applied',
  'pending',
  'contacted',
  'interview',
  'rejected',
  'closed',
] as const

export const STATUS_COLORS = {
  applied: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  contacted: 'bg-purple-100 text-purple-800',
  interview: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-gray-100 text-gray-800',
} as const

export const API_ENDPOINTS = {
  APPLICATIONS: '/applications',
  REMINDERS: '/reminders',
  ANALYTICS_SUMMARY: '/analytics/summary',
  ANALYTICS_TRENDS: '/analytics/trends',
  AUTH_GOOGLE: '/auth/google',
  AUTH_CALLBACK: '/auth/callback',
  SHEETS_INIT: '/sheets/init',
} as const
