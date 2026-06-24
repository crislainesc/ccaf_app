/**
 * Dynamic schedule generator.
 *
 * Given a start date (today) and an exam date chosen by the user, this module
 * distributes all study activities across the available days.
 *
 * Layout (minimum 4 days needed for the full experience):
 *   - Day 1 … N-3 : Core study days — courses in their recommended sortOrder,
 *                   packed into buckets so heavier days come first.
 *   - Day N-2     : Review + first mock exam
 *   - Day N-1     : Gap review + final mock exam
 *   - Day N       : Exam day (light review + the exam itself)
 *
 * Edge cases:
 *   - 3 days  → 1 study day + review/mock day + exam day
 *   - 2 days  → 1 study day + exam day (review skipped)
 *   - 1 day   → everything crammed into the single day
 */

import {
  courses,
  type ScheduleActivity,
  type ScheduleDay,
} from '@/data/studyPlan'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function toLabel(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(date)
}

/** Returns an array of Date objects from startDate up to and including endDate. */
function daysBetween(startDate: Date, endDate: Date): Date[] {
  const result: Date[] = []
  const cursor = new Date(startDate)
  cursor.setHours(0, 0, 0, 0)
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)
  while (cursor <= end) {
    result.push(new Date(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return result
}

// ---------------------------------------------------------------------------
// Activity factories
// ---------------------------------------------------------------------------

function courseActivity(course: (typeof courses)[number]): ScheduleActivity {
  return {
    id: `act-${course.id}`,
    courseId: course.id,
    title: course.name,
    estimatedMinutes: course.estimatedMinutes,
    url: course.url,
    notes: course.description,
  }
}

const REVIEW_ACTIVITIES: ScheduleActivity[] = [
  {
    id: 'act-review-building-api',
    courseId: 'building-api',
    title: 'Revisar Building with the Claude API',
    estimatedMinutes: 60,
    notes: 'Reforçar tópicos fracos: tool use, XML e prompt chaining.',
  },
  {
    id: 'act-review-claude-code',
    courseId: 'claude-code-action',
    title: 'Revisar Claude Code in Action',
    estimatedMinutes: 45,
    notes: 'Revisar refatoração, debug e automação.',
  },
  {
    id: 'act-mock-1',
    title: 'Simulado completo',
    estimatedMinutes: 120,
    notes: 'Cronometrar, listar erros e mirar 75%+.',
  },
]

const GAP_REVIEW_ACTIVITIES: ScheduleActivity[] = [
  {
    id: 'act-gap-review',
    title: 'Revisar erros do simulado',
    estimatedMinutes: 150,
    notes: 'Revisitar cursos com lacunas e mirar 80%+.',
  },
  {
    id: 'act-final-mock',
    title: 'Simulado final',
    estimatedMinutes: 150,
    notes: 'Ambiente real de prova — meta 85%+.',
  },
]

const EXAM_DAY_ACTIVITIES: ScheduleActivity[] = [
  {
    id: 'act-summary',
    title: 'Revisar resumo pessoal',
    estimatedMinutes: 45,
    notes: 'Revisão leve: conceitos-chave, sem estudar conteúdo novo.',
  },
  {
    id: 'act-exam',
    title: 'Fazer a prova',
    estimatedMinutes: 120,
    notes: 'Claude Certified Architect Foundation — boa sorte!',
  },
]

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateSchedule(
  startDate: Date,
  examDate: Date,
): ScheduleDay[] {
  const days = daysBetween(startDate, examDate)
  const total = days.length

  if (total === 0) return []

  // Courses in their prescribed study order (sortOrder asc)
  const orderedCourses = [...courses].sort((a, b) => a.sortOrder - b.sortOrder)

  // Single day: everything today
  if (total === 1) {
    const d = days[0]
    return [
      {
        id: toDateString(d),
        date: toDateString(d),
        label: toLabel(d),
        theme: 'Exame CCAF',
        activities: [
          ...orderedCourses.map(courseActivity),
          ...EXAM_DAY_ACTIVITIES,
        ],
      },
    ]
  }

  // Reserve tail days for review/mock/exam (min 1 study day always kept)
  const reservedTail = Math.min(3, total - 1)
  const studyDays = days.slice(0, total - reservedTail)
  const tailDays = days.slice(total - reservedTail)

  // --- Distribute courses across study days ---
  // Fill buckets round-robin in sortOrder so day 1 always gets the earliest
  // courses, preserving the recommended sequence as much as possible.
  const buckets: (typeof courses)[] = studyDays.map(() => [])
  orderedCourses.forEach((course, idx) => {
    buckets[idx % studyDays.length].push(course)
  })

  const studySchedule: ScheduleDay[] = studyDays.map((d, idx) => {
    const bucket = buckets[idx]
    const theme =
      bucket.length === 1
        ? bucket[0].name
        : bucket
            .map((c) => c.name.split(':')[0].split(' ').slice(0, 3).join(' '))
            .join(' + ')

    return {
      id: toDateString(d),
      date: toDateString(d),
      label: toLabel(d),
      theme,
      activities: bucket.map(courseActivity),
    }
  })

  // --- Tail days ---
  const tailSchedule: ScheduleDay[] = []

  if (reservedTail >= 3) {
    tailSchedule.push({
      id: toDateString(tailDays[0]),
      date: toDateString(tailDays[0]),
      label: toLabel(tailDays[0]),
      theme: 'Revisão e Simulado',
      activities: REVIEW_ACTIVITIES,
    })
    tailSchedule.push({
      id: toDateString(tailDays[1]),
      date: toDateString(tailDays[1]),
      label: toLabel(tailDays[1]),
      theme: 'Correção de Lacunas',
      activities: GAP_REVIEW_ACTIVITIES,
    })
  } else if (reservedTail === 2) {
    tailSchedule.push({
      id: toDateString(tailDays[0]),
      date: toDateString(tailDays[0]),
      label: toLabel(tailDays[0]),
      theme: 'Revisão e Simulados',
      activities: [...REVIEW_ACTIVITIES, ...GAP_REVIEW_ACTIVITIES],
    })
  }
  // reservedTail === 1 → go straight to exam day

  // Exam day is always the last day
  const examDay = tailDays[tailDays.length - 1]
  tailSchedule.push({
    id: toDateString(examDay),
    date: toDateString(examDay),
    label: toLabel(examDay),
    theme: 'Exame CCAF',
    activities: EXAM_DAY_ACTIVITIES,
  })

  return [...studySchedule, ...tailSchedule]
}
