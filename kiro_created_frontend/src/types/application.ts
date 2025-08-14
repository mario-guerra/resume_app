export interface JobApplication {
  id: string
  company: string
  job_title: string
  location?: string
  description?: string
  link?: string
  contact?: string
  referral?: string
  date_applied: string // ISO8601
  status:
    | 'applied'
    | 'pending'
    | 'contacted'
    | 'interview'
    | 'rejected'
    | 'closed'
  favorite: boolean
}

export interface CreateJobApplicationRequest {
  company: string
  job_title: string
  location?: string
  description?: string
  link?: string
  contact?: string
  referral?: string
  date_applied: string
  status:
    | 'applied'
    | 'pending'
    | 'contacted'
    | 'interview'
    | 'rejected'
    | 'closed'
  favorite: boolean
}

export type UpdateJobApplicationRequest = Partial<CreateJobApplicationRequest>
