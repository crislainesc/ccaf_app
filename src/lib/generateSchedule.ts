/**
 * Dynamic schedule generator.
 *
 * Given a start date (today) and an exam date chosen by the user, this module
 * distributes all study activities across the available days.
 *
 * Layout (minimum 3 days needed):
 *   - Day 1 … N-3 : Core study days (courses spread evenly)
 *   - Day N-2     : Review + mock exam 1
 *   - Day N-1     : Gap review + second mock
 *   - Day N       : Exam day (light review + the exam itself)
 *
 * If fewer than 3 days are available, every remaining course is crammed into
 * a single day so the schedule is always usable.
 */

import { courses, type ScheduleActivity, type ScheduleDay } from "@/data/studyPlan";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toLabel(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit" }).format(date);
}

/** Returns an array of Date objects from startDate up to and including endDate. */
function daysBetween(startDate: Date, endDate: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(startDate);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
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
  };
}

const REVIEW_ACTIVITIES: ScheduleActivity[] = [
  {
    id: "act-review-api-1",
    courseId: "building-api",
    title: "Revisar Building with the Claude API",
    estimatedMinutes: 60,
    notes: "Reforçar tópicos fracos.",
  },
  {
    id: "act-review-api-2",
    courseId: "anthropic-api",
    title: "Revisar Claude with Anthropic API",
    estimatedMinutes: 60,
    notes: "Revisar parâmetros e custos.",
  },
  {
    id: "act-mock-1",
    title: "Simulado completo",
    estimatedMinutes: 120,
    notes: "Cronometrar, listar erros e mirar 75%+.",
  },
];

const GAP_REVIEW_ACTIVITIES: ScheduleActivity[] = [
  {
    id: "act-gap-review",
    title: "Revisar erros do simulado",
    estimatedMinutes: 150,
    notes: "Revisitar cursos fracos e mirar 80%+.",
  },
  {
    id: "act-final-mock",
    title: "Simulado final",
    estimatedMinutes: 150,
    notes: "Ambiente real de prova e meta 85%+.",
  },
];

const EXAM_DAY_ACTIVITIES: ScheduleActivity[] = [
  {
    id: "act-summary",
    title: "Revisar resumo pessoal",
    estimatedMinutes: 45,
    notes: "Revisão leve antes da prova.",
  },
  {
    id: "act-exam",
    title: "Fazer a prova",
    estimatedMinutes: 120,
    notes: "Claude Certified Architect Foundation.",
  },
];

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export function generateSchedule(startDate: Date, examDate: Date): ScheduleDay[] {
  const days = daysBetween(startDate, examDate);
  const total = days.length;

  if (total === 0) return [];

  // Single day edge-case: everything on the same day as the exam
  if (total === 1) {
    const d = days[0];
    return [
      {
        id: toDateString(d),
        date: toDateString(d),
        label: toLabel(d),
        theme: "Exame CCAF",
        activities: [...courses.map(courseActivity), ...EXAM_DAY_ACTIVITIES],
      },
    ];
  }

  // Reserve last 3 days (or 2, or 1) for review/mock/exam
  const reservedTail = Math.min(3, total - 1); // always keep at least 1 study day
  const studyDays = days.slice(0, total - reservedTail);
  const tailDays = days.slice(total - reservedTail);

  // ----- Distribute courses across study days -----
  // Sort by importance desc so the most critical courses land earliest
  const sortedCourses = [...courses].sort((a, b) => b.importance - a.importance);

  // Group courses into buckets (one per study day, round-robin by importance)
  const buckets: (typeof courses)[] = studyDays.map(() => []);
  sortedCourses.forEach((course, idx) => {
    buckets[idx % studyDays.length].push(course);
  });

  const studySchedule: ScheduleDay[] = studyDays.map((d, idx) => {
    const bucket = buckets[idx];
    const theme =
      bucket.length === 1
        ? bucket[0].name
        : bucket.map((c) => c.name.split(" ")[0]).join(" + ");

    return {
      id: toDateString(d),
      date: toDateString(d),
      label: toLabel(d),
      theme,
      activities: bucket.map(courseActivity),
    };
  });

  // ----- Tail days -----
  const tailSchedule: ScheduleDay[] = [];

  if (reservedTail >= 3) {
    // Day N-2: Review + mock 1
    tailSchedule.push({
      id: toDateString(tailDays[0]),
      date: toDateString(tailDays[0]),
      label: toLabel(tailDays[0]),
      theme: "Revisão e Simulado",
      activities: REVIEW_ACTIVITIES,
    });
    // Day N-1: Gap review + mock 2
    tailSchedule.push({
      id: toDateString(tailDays[1]),
      date: toDateString(tailDays[1]),
      label: toLabel(tailDays[1]),
      theme: "Correção de Lacunas",
      activities: GAP_REVIEW_ACTIVITIES,
    });
  } else if (reservedTail === 2) {
    // Day N-1: All review + both mocks compressed
    tailSchedule.push({
      id: toDateString(tailDays[0]),
      date: toDateString(tailDays[0]),
      label: toLabel(tailDays[0]),
      theme: "Revisão e Simulados",
      activities: [...REVIEW_ACTIVITIES, ...GAP_REVIEW_ACTIVITIES],
    });
  }
  // (reservedTail === 1 → skip directly to exam day)

  // Exam day always last
  const examDay = tailDays[tailDays.length - 1];
  tailSchedule.push({
    id: toDateString(examDay),
    date: toDateString(examDay),
    label: toLabel(examDay),
    theme: "Exame CCAF",
    activities: EXAM_DAY_ACTIVITIES,
  });

  return [...studySchedule, ...tailSchedule];
}
