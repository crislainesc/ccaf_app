/**
 * Dynamic schedule generator.
 *
 * Strategy — always fills every study day:
 *
 *   SHORT  (studyDays ≤ courses):
 *     Round-robin: courses are packed into buckets, multiple courses per day.
 *
 *   MEDIUM (courses < studyDays < courses * 3):
 *     Each course gets its own day. Extra days are filled with prioritised
 *     review sessions (most-important courses first) until all days are used.
 *
 *   LONG   (studyDays ≥ courses * 3):
 *     Every course gets three sessions across the plan:
 *       1st pass  → introduction / first study
 *       Deep dive → detailed study + checklist focus
 *       Review    → consolidation before the exam
 *     Any days still remaining are filled with targeted practice for the two
 *     highest-importance courses (building-api, claude-code-action).
 *
 * Tail (last 1–3 days, always reserved):
 *   N-2: Review + mock 1
 *   N-1: Gap correction + mock 2
 *   N  : Exam day
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

type CourseEntry = (typeof courses)[number]

// ---------------------------------------------------------------------------
// Activity builders
// ---------------------------------------------------------------------------

function firstPassActivity(c: CourseEntry): ScheduleActivity {
  return {
    id: `act-first-${c.id}`,
    courseId: c.id,
    title: `${c.name} — 1ª passagem`,
    estimatedMinutes: Math.round(c.estimatedMinutes * 0.6),
    url: c.url,
    notes: `Visão geral e primeiros conceitos. Foco: ${c.checklist.slice(0, 2).join(', ')}.`,
  }
}

function deepDiveActivity(c: CourseEntry): ScheduleActivity {
  return {
    id: `act-deep-${c.id}`,
    courseId: c.id,
    title: `${c.name} — Estudo aprofundado`,
    estimatedMinutes: c.estimatedMinutes,
    url: c.url,
    notes: `Checklist completo. Foco: ${c.checklist.slice(2).join(', ')}.`,
  }
}

function reviewActivity(c: CourseEntry): ScheduleActivity {
  return {
    id: `act-rev-${c.id}`,
    courseId: c.id,
    title: `Revisar ${c.name}`,
    estimatedMinutes: Math.round(c.estimatedMinutes * 0.4),
    url: c.url,
    notes: `Consolidação: reverifique todos os itens do checklist e anote dúvidas.`,
  }
}

function fullCourseActivity(c: CourseEntry): ScheduleActivity {
  return {
    id: `act-${c.id}`,
    courseId: c.id,
    title: c.name,
    estimatedMinutes: c.estimatedMinutes,
    url: c.url,
    notes: c.description,
  }
}

function practiceActivity(c: CourseEntry, seq: number): ScheduleActivity {
  const prompts = [
    `Pratique os exercícios do checklist e refaça exemplos sem consultar anotações.`,
    `Explique em voz alta cada item do checklist — "learn by teaching".`,
    `Monte um mini-resumo de uma página com os pontos mais cobrados no exame.`,
    `Identifique as 3 dúvidas que ainda restam e resolva-as hoje.`,
    `Simule perguntas de prova sobre este tópico e responda sem apoio.`,
  ]
  return {
    id: `act-practice-${c.id}-${seq}`,
    courseId: c.id,
    title: `Praticar ${c.name}`,
    estimatedMinutes: Math.round(c.estimatedMinutes * 0.5),
    url: c.url,
    notes: prompts[seq % prompts.length],
  }
}

// ---------------------------------------------------------------------------
// Fixed tail activities
// ---------------------------------------------------------------------------

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
// Tail-day builder (always the last 1–3 days)
// ---------------------------------------------------------------------------

function buildTailDays(tailDates: Date[], reservedTail: number): ScheduleDay[] {
  const tail: ScheduleDay[] = []

  if (reservedTail >= 3) {
    tail.push({
      id: toDateString(tailDates[0]),
      date: toDateString(tailDates[0]),
      label: toLabel(tailDates[0]),
      theme: 'Revisão e Simulado',
      activities: REVIEW_ACTIVITIES,
    })
    tail.push({
      id: toDateString(tailDates[1]),
      date: toDateString(tailDates[1]),
      label: toLabel(tailDates[1]),
      theme: 'Correção de Lacunas',
      activities: GAP_REVIEW_ACTIVITIES,
    })
  } else if (reservedTail === 2) {
    tail.push({
      id: toDateString(tailDates[0]),
      date: toDateString(tailDates[0]),
      label: toLabel(tailDates[0]),
      theme: 'Revisão e Simulados',
      activities: [...REVIEW_ACTIVITIES, ...GAP_REVIEW_ACTIVITIES],
    })
  }

  const examDate = tailDates[tailDates.length - 1]
  tail.push({
    id: toDateString(examDate),
    date: toDateString(examDate),
    label: toLabel(examDate),
    theme: 'Exame CCAF',
    activities: EXAM_DAY_ACTIVITIES,
  })

  return tail
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateSchedule(
  startDate: Date,
  examDate: Date,
): ScheduleDay[] {
  const allDays = daysBetween(startDate, examDate)
  const total = allDays.length

  if (total === 0) return []

  // Courses sorted by the recommended study order
  const ordered = [...courses].sort((a, b) => a.sortOrder - b.sortOrder)
  const n = ordered.length // 11

  // ---- Single day edge-case ------------------------------------------------
  if (total === 1) {
    const d = allDays[0]
    return [
      {
        id: toDateString(d),
        date: toDateString(d),
        label: toLabel(d),
        theme: 'Exame CCAF',
        activities: [
          ...ordered.map(fullCourseActivity),
          ...EXAM_DAY_ACTIVITIES,
        ],
      },
    ]
  }

  // ---- Reserve tail days ---------------------------------------------------
  const reservedTail = Math.min(3, total - 1)
  const studyDates = allDays.slice(0, total - reservedTail)
  const tailDates = allDays.slice(total - reservedTail)
  const studyDayCount = studyDates.length

  // ---- Build a flat activity queue that fills exactly studyDayCount days ---
  //
  // We expand each course into multiple sessions depending on how many days
  // we have to fill. The queue is built as an ordered list of ScheduleActivity;
  // we then chunk it into per-day slots.

  const activityQueue: Array<{ activity: ScheduleActivity; theme: string }> = []

  if (studyDayCount <= n) {
    // SHORT: more courses than days — pack multiple courses per day via
    // round-robin. Build one activity per course and let the chunker group them.
    ordered.forEach((c) =>
      activityQueue.push({
        activity: fullCourseActivity(c),
        theme: c.name,
      }),
    )
  } else if (studyDayCount < n * 3) {
    // MEDIUM: more days than courses but less than 3× — each course gets its
    // own day first, then distribute review sessions to fill leftover days.

    // Pass 1: every course gets one full day
    ordered.forEach((c) =>
      activityQueue.push({
        activity: fullCourseActivity(c),
        theme: c.name,
      }),
    )

    // Remaining slots: fill with review sessions, highest-importance first
    const byImportance = [...ordered].sort(
      (a, b) => b.importance - a.importance,
    )
    let extra = studyDayCount - n
    let reviewCycle = 0
    while (extra > 0) {
      const c = byImportance[reviewCycle % byImportance.length]
      activityQueue.push({
        activity: reviewActivity(c),
        theme: `Revisão — ${c.name}`,
      })
      reviewCycle++
      extra--
    }
  } else {
    // LONG: 3× courses or more — give every course 3 sessions (first pass,
    // deep dive, review), then fill any remaining slots with practice sessions
    // cycling through courses by importance.

    // Pass 1 — introductory sessions in sortOrder
    ordered.forEach((c) =>
      activityQueue.push({
        activity: firstPassActivity(c),
        theme: `${c.name} — 1ª passagem`,
      }),
    )

    // Pass 2 — deep dive in sortOrder
    ordered.forEach((c) =>
      activityQueue.push({
        activity: deepDiveActivity(c),
        theme: `${c.name} — Aprofundamento`,
      }),
    )

    // Pass 3 — review in sortOrder
    ordered.forEach((c) =>
      activityQueue.push({
        activity: reviewActivity(c),
        theme: `Revisão — ${c.name}`,
      }),
    )

    // Extra slots: practice, cycling by importance
    const byImportance = [...ordered].sort(
      (a, b) => b.importance - a.importance,
    )
    let extra = studyDayCount - n * 3
    let practiceSeq = 0
    while (extra > 0) {
      const c = byImportance[practiceSeq % byImportance.length]
      activityQueue.push({
        activity: practiceActivity(c, practiceSeq),
        theme: `Praticar — ${c.name}`,
      })
      practiceSeq++
      extra--
    }
  }

  // ---- Chunk the queue into per-day slots ----------------------------------
  //
  // SHORT mode: multiple activities per day (round-robin produced N activities
  // for fewer-than-N days, so we distribute evenly).
  // MEDIUM / LONG mode: exactly one activity per day already.

  const studySchedule: ScheduleDay[] = studyDates.map((d, dayIdx) => {
    let dayActivities: ScheduleActivity[]
    let theme: string

    if (studyDayCount <= n) {
      // Pack remaining courses into fewer days via round-robin buckets
      const bucket = activityQueue.filter(
        (_, qIdx) => qIdx % studyDayCount === dayIdx,
      )
      dayActivities = bucket.map((b) => b.activity)
      theme =
        bucket.length === 1
          ? bucket[0].theme
          : bucket
              .map((b) =>
                b.theme.split(':')[0].split(' ').slice(0, 3).join(' '),
              )
              .join(' + ')
    } else {
      // One slot per day
      const slot = activityQueue[dayIdx]
      dayActivities = [slot.activity]
      theme = slot.theme
    }

    return {
      id: toDateString(d),
      date: toDateString(d),
      label: toLabel(d),
      theme,
      activities: dayActivities,
    }
  })

  return [...studySchedule, ...buildTailDays(tailDates, reservedTail)]
}
