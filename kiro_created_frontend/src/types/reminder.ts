export interface Reminder {
  id: string
  application_id: string
  reminder_date: string // ISO8601
  note: string
}

export interface CreateReminderRequest {
  application_id: string
  reminder_date: string
  note: string
}

export type UpdateReminderRequest = Partial<CreateReminderRequest>
