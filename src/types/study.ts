import type { CourseStatus } from '@/data/studyPlan'

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export type Tab = 'home' | 'schedule' | 'courses'

export type MockScore = {
  /** ISO date string of when the mock was taken, e.g. "2026-06-25". */
  date: string
  /** Score percentage 0–100. */
  score: number
  /** Label auto-generated or user-provided, e.g. "Simulado 1". */
  label: string
}

export type StudyState = {
  /** ISO date string chosen by the user, e.g. "2026-07-15". null = not configured. */
  examDate: string | null
  /** ISO date string of the day the user completed setup (= plan start). */
  startDate: string | null
  checklist: Record<string, boolean>
  activities: Record<string, boolean>
  notes: Record<string, string>
  /** Ordered list of mock exam scores entered by the user. */
  mockScores: MockScore[]
  theme: 'light' | 'dark'
}

export type Countdown = {
  /** Calendar days from today (midnight) to exam day (midnight). */
  days: number
  /** Total full hours remaining until exam midnight — not just leftover after stripping days. */
  totalHours: number
  minutes: number
  /** Percentage of plan time elapsed (0–100). */
  used: number
  urgency: 'calm' | 'yellow' | 'orange' | 'danger'
  /** Human-readable exam date label, e.g. "29/06/2026". */
  examLabel: string
}

export type CourseWithProgress = {
  id: string
  name: string
  description: string
  importance: number
  estimatedMinutes: number
  url: string
  checklist: string[]
  done: number
  progress: number
  status: CourseStatus
}

export type Totals = {
  checklistTotal: number
  checklistDone: number
  activitiesTotal: number
  activitiesDone: number
  completedCourses: number
  /** Weighted overall progress (0–100). */
  general: number
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const STORAGE_KEY = 'ccaf-study-state-v4'

export const INITIAL_STATE: StudyState = {
  examDate: null,
  startDate: null,
  checklist: {},
  activities: {},
  notes: {},
  mockScores: [],
  theme: 'dark',
}

export const STATUS_LABELS: Record<CourseStatus, string> = {
  'not-started': 'Não iniciado',
  'in-progress': 'Em andamento',
  completed: 'Concluído',
}
