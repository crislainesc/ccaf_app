import { useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppNav } from '@/components/layout/AppNav'
import { CoursesPage } from '@/pages/CoursesPage'
import { HomePage } from '@/pages/HomePage'
import { SchedulePage } from '@/pages/SchedulePage'
import { SetupPage } from '@/pages/SetupPage'
import { useStudyState } from '@/hooks/useStudyState'
import type { Tab } from '@/types/study'

export default function App() {
  const [tab, setTab] = useState<Tab>('home')

  const {
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
    logMockScore,
    clearMockScores,
  } = useStudyState()

  // Before the user sets an exam date, show only the setup screen
  if (!state.examDate) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <AppHeader theme={state.theme} onToggleTheme={toggleTheme} />
        <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
          <SetupPage onConfirm={handleSetupConfirm} />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader theme={state.theme} onToggleTheme={toggleTheme} />
      <AppNav activeTab={tab} onTabChange={setTab} />

      <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
        {tab === 'home' && countdown && (
          <HomePage
            totals={totals}
            countdown={countdown}
            nextCourse={nextCourse}
            mockScores={state.mockScores ?? []}
            onStart={() => setTab('courses')}
            onReset={handleReset}
            onLogMockScore={logMockScore}
            onClearMockScores={clearMockScores}
          />
        )}

        {tab === 'schedule' && (
          <SchedulePage
            schedule={schedule}
            activities={state.activities}
            onToggleActivity={toggleActivity}
          />
        )}

        {tab === 'courses' && (
          <CoursesPage
            courseProgress={courseProgress}
            checklist={state.checklist}
            notes={state.notes}
            onToggleChecklist={toggleChecklist}
            onUpdateNote={updateNote}
          />
        )}
      </main>
    </div>
  )
}
