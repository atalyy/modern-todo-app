export type Priority = 'low' | 'medium' | 'high'

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface Category {
  id: string
  name: string
  color: string // Tailwind color class or hex, e.g. '#3b82f6', '#ec4899', '#10b981'
  icon?: string
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: string
  priority: Priority
  categoryId: string
  dueDate?: string // YYYY-MM-DD
  subtasks: Subtask[]
  order: number
  pinned?: boolean
  createdAt: string
  updatedAt: string
}

export type ActiveView = 
  | 'all'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'high-priority'
  | 'category'

export type SortBy = 'order' | 'dueDate' | 'priority' | 'alphabetical' | 'createdAt'
export type SortDirection = 'asc' | 'desc'

export interface TodoStats {
  total: number
  completed: number
  pending: number
  completionRate: number
  dueToday: number
  overdue: number
  completedThisWeek: number
  dailyBreakdown: { day: string; date: string; completed: number; created: number }[]
}

export interface Toast {
  id: string
  title: string
  description?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  undoAction?: () => void
}
