import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ApiResponse } from '@/types/api'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      config => {
        // TODO: Add auth token from NextAuth session
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      error => {
        if (error.response?.status === 401) {
          // TODO: Handle authentication error
          console.error('Authentication required')
        }
        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url)
    return response.data.data
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data)
    return response.data.data
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data)
    return response.data.data
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url)
    return response.data.data
  }
}

export const apiClient = new ApiClient()
