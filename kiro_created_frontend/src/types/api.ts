export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}
