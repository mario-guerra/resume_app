export interface AnalyticsSummary {
  total_applications: number
  response_rate: number
  interview_rate: number
  top_companies: string[]
}

export interface AnalyticsTrends {
  top_roles: string[]
  top_companies: string[]
  application_trends: Array<{
    month: string
    count: number
  }>
}

export interface FilterState {
  search: string
  status: string[]
  dateRange: {
    start: Date | null
    end: Date | null
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
}
