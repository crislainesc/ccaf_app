import type { CourseStatus } from "@/data/studyPlan";

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

export type Tab = "home" | "schedule" | "courses";

export type StudyState = {
  /** ISO date string chosen by the user, e.g. "2026-07-15". null = not configured. */
  examDate: string | null;
  /** ISO date string of the day the user completed setup (= plan start). */
  startDate: string | null;
  checklist: Record<string, boolean>;
  activities: Record<string, boolean>;
  notes: Record<string, string>;
  theme: "light" | "dark";
};

export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  /** Percentage of plan time elapsed (0–100). */
  used: number;
  urgency: "calm" | "yellow" | "orange" | "danger";
  /** Human-readable exam date label, e.g. "29/06/2026". */
  examLabel: string;
};

export type CourseWithProgress = {
  id: string;
  name: string;
  description: string;
  importance: number;
  estimatedMinutes: number;
  url: string;
  checklist: string[];
  done: number;
  progress: number;
  status: CourseStatus;
};

export type Totals = {
  checklistTotal: number;
  checklistDone: number;
  activitiesTotal: number;
  activitiesDone: number;
  completedCourses: number;
  /** Weighted overall progress (0–100). */
  general: number;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const STORAGE_KEY = "ccaf-study-state-v3";

export const INITIAL_STATE: StudyState = {
  examDate: null,
  startDate: null,
  checklist: {},
  activities: {},
  notes: {},
  theme: "dark",
};

export const STATUS_LABELS: Record<CourseStatus, string> = {
  "not-started": "Não iniciado",
  "in-progress": "Em andamento",
  completed: "Concluído",
};
