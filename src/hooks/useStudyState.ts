import { useCallback, useEffect, useMemo } from "react";
import { courses } from "@/data/studyPlan";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNow } from "@/hooks/useNow";
import { parseLocalDate, todayISO } from "@/lib/dateUtils";
import { generateSchedule } from "@/lib/generateSchedule";
import { pct } from "@/lib/utils";
import {
  INITIAL_STATE,
  STORAGE_KEY,
  type Countdown,
  type CourseWithProgress,
  type StudyState,
  type Totals,
} from "@/types/study";
import type { ScheduleDay } from "@/data/studyPlan";

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export type UseStudyStateReturn = {
  // Raw persisted state
  state: StudyState;
  // Derived values
  schedule: ScheduleDay[];
  courseProgress: CourseWithProgress[];
  totals: Totals;
  countdown: Countdown | null;
  nextCourse: CourseWithProgress;
  // Handlers
  handleSetupConfirm: (examDate: string) => void;
  handleReset: () => void;
  toggleChecklist: (courseId: string, item: string) => void;
  toggleActivity: (id: string) => void;
  updateNote: (courseId: string, value: string) => void;
  toggleTheme: () => void;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useStudyState(): UseStudyStateReturn {
  const [state, setState] = useLocalStorage<StudyState>(STORAGE_KEY, INITIAL_STATE);
  const now = useNow();

  // Keep <html> class in sync with the theme preference
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.theme]);

  // Build schedule from the stored dates — regenerated only when they change
  const schedule = useMemo<ScheduleDay[]>(() => {
    if (!state.examDate || !state.startDate) return [];
    return generateSchedule(
      parseLocalDate(state.startDate),
      parseLocalDate(state.examDate),
    );
  }, [state.examDate, state.startDate]);

  // Per-course progress derived from checklist state
  const courseProgress = useMemo<CourseWithProgress[]>(() => {
    return courses.map((course) => {
      const done = course.checklist.filter(
        (item) => state.checklist[`${course.id}:${item}`],
      ).length;
      const progress = pct(done, course.checklist.length);
      const status =
        progress === 0 ? "not-started" : progress === 100 ? "completed" : "in-progress";
      return { ...course, done, progress, status } as CourseWithProgress;
    });
  }, [state.checklist]);

  // Aggregate totals for the home screen
  const totals = useMemo<Totals>(() => {
    const checklistTotal = courses.reduce((s, c) => s + c.checklist.length, 0);
    const checklistDone = courses.reduce(
      (s, c) =>
        s + c.checklist.filter((item) => state.checklist[`${c.id}:${item}`]).length,
      0,
    );
    const allActivities = schedule.flatMap((d) => d.activities);
    const activitiesDone = allActivities.filter((a) => state.activities[a.id]).length;
    const completedCourses = courseProgress.filter((c) => c.status === "completed").length;
    const general = Math.round(
      pct(checklistDone, checklistTotal) * 0.65 +
        pct(activitiesDone, allActivities.length) * 0.35,
    );
    return {
      checklistTotal,
      checklistDone,
      activitiesTotal: allActivities.length,
      activitiesDone,
      completedCourses,
      general,
    };
  }, [courseProgress, state.activities, state.checklist, schedule]);

  // Countdown derived entirely from the user-chosen exam date
  const countdown = useMemo<Countdown | null>(() => {
    if (!state.examDate || !state.startDate) return null;

    const target = parseLocalDate(state.examDate).getTime();
    const start = parseLocalDate(state.startDate).getTime();
    const current = now.getTime();
    const remainingMs = Math.max(target - current, 0);

    const days = Math.floor(remainingMs / 86_400_000);
    const hours = Math.floor((remainingMs % 86_400_000) / 3_600_000);
    const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
    const span = target - start;
    const used = span > 0
      ? Math.min(Math.max(((current - start) / span) * 100, 0), 100)
      : 100;
    const urgency =
      days < 1 ? "danger" : days < 3 ? "orange" : days < 7 ? "yellow" : "calm";

    const examLabel = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(parseLocalDate(state.examDate));

    return { days, hours, minutes, used: Math.round(used), urgency, examLabel };
  }, [now, state.examDate, state.startDate]);

  const nextCourse =
    courseProgress.find((c) => c.status !== "completed") ?? courseProgress[0];

  // ---------------------------------------------------------------------------
  // Handlers — stable references via useCallback
  // ---------------------------------------------------------------------------

  const handleSetupConfirm = useCallback(
    (examDate: string) => {
      setState((prev) => ({
        ...prev,
        examDate,
        startDate: todayISO(),
        checklist: {},
        activities: {},
        notes: {},
      }));
    },
    [setState],
  );

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      examDate: null,
      startDate: null,
      checklist: {},
      activities: {},
      notes: {},
    }));
  }, [setState]);

  const toggleChecklist = useCallback(
    (courseId: string, item: string) => {
      const key = `${courseId}:${item}`;
      setState((prev) => ({
        ...prev,
        checklist: { ...prev.checklist, [key]: !prev.checklist[key] },
      }));
    },
    [setState],
  );

  const toggleActivity = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        activities: { ...prev.activities, [id]: !prev.activities[id] },
      }));
    },
    [setState],
  );

  const updateNote = useCallback(
    (courseId: string, value: string) => {
      setState((prev) => ({
        ...prev,
        notes: { ...prev.notes, [courseId]: value },
      }));
    },
    [setState],
  );

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, [setState]);

  return {
    state,
    schedule,
    courseProgress,
    totals,
    countdown,
    nextCourse,
    handleSetupConfirm,
    handleReset,
    toggleChecklist,
    toggleActivity,
    updateNote,
    toggleTheme,
  };
}
