import { ClipboardList, Play, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Metric } from '@/components/shared/Metric'
import { MockScoreDialog } from '@/components/shared/MockScoreDialog'
import { courses } from '@/data/studyPlan'
import { cn } from '@/lib/utils'
import type {
  Countdown,
  CourseWithProgress,
  MockScore,
  Totals,
} from '@/types/study'
import { STATUS_LABELS } from '@/types/study'

const URGENCY_CLASS: Record<string, string> = {
  danger: 'from-red-600 to-rose-500 text-white',
  orange: 'from-orange-500 to-red-500 text-white',
  yellow: 'from-amber-400 to-yellow-500 text-slate-950',
  calm: 'from-cyan-500 to-emerald-500 text-slate-950',
}

type HomePageProps = {
  totals: Totals
  countdown: Countdown
  nextCourse: CourseWithProgress
  mockScores: MockScore[]
  onStart: () => void
  onReset: () => void
  onLogMockScore: (score: number) => void
  onClearMockScores: () => void
}

export function HomePage({
  totals,
  countdown,
  nextCourse,
  mockScores,
  onStart,
  onReset,
  onLogMockScore,
  onClearMockScores,
}: HomePageProps) {
  return (
    <div className="space-y-5">
      <CountdownBanner countdown={countdown} onReset={onReset} />
      <StatsGrid
        totals={totals}
        nextCourse={nextCourse}
        mockScores={mockScores}
        onStart={onStart}
        onLogMockScore={onLogMockScore}
        onClearMockScores={onClearMockScores}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// CountdownBanner
// ---------------------------------------------------------------------------

function CountdownBanner({
  countdown,
  onReset,
}: {
  countdown: Countdown
  onReset: () => void
}) {
  return (
    <section
      className={cn(
        'rounded-lg bg-gradient-to-br p-5 shadow-app sm:p-6',
        URGENCY_CLASS[countdown.urgency],
      )}>
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-normal opacity-80">
              Prova em {countdown.examLabel}
            </p>
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-md border border-current/30 px-2 py-1 text-xs font-medium opacity-80 transition-opacity hover:opacity-100"
              title="Alterar data da prova">
              <RotateCcw className="h-3 w-3" />
              Alterar data
            </button>
          </div>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
            {countdown.days} dias
          </h2>
          <p className="mt-2 text-lg font-medium">
            {countdown.totalHours}h e {countdown.minutes}min restantes
          </p>
        </div>

        <div className="rounded-md bg-white/18 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>Tempo usado do plano</span>
            <span>{countdown.used}%</span>
          </div>
          <Progress
            value={countdown.used}
            className="mt-3 bg-white/30"
            indicatorClassName="bg-white"
          />
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// StatsGrid
// ---------------------------------------------------------------------------

function StatsGrid({
  totals,
  nextCourse,
  mockScores,
  onStart,
  onLogMockScore,
  onClearMockScores,
}: {
  totals: Totals
  nextCourse: CourseWithProgress
  mockScores: MockScore[]
  onStart: () => void
  onLogMockScore: (score: number) => void
  onClearMockScores: () => void
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-4">
      {/* Overall progress — spans 2 columns on large screens */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Progresso Geral</CardTitle>
          <CardDescription>
            Checklist, atividades e cursos concluídos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4">
            <span className="text-5xl font-bold">{totals.general}%</span>
            <Badge variant="secondary">
              {totals.completedCourses}/{courses.length} cursos
            </Badge>
          </div>
          <Progress value={totals.general} className="mt-4" />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Metric
              label="Itens concluídos"
              value={`${totals.checklistDone}/${totals.checklistTotal}`}
            />
            <Metric
              label="Atividades feitas"
              value={`${totals.activitiesDone}/${totals.activitiesTotal}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Mock exam scores */}
      <MockScoresCard
        mockScores={mockScores}
        onLog={onLogMockScore}
        onClear={onClearMockScores}
      />

      {/* Next activity */}
      <Card>
        <CardHeader>
          <CardTitle>Próxima atividade</CardTitle>
          <CardDescription>{STATUS_LABELS[nextCourse.status]}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-semibold">{nextCourse.name}</p>
          <Progress value={nextCourse.progress} className="mt-3" />
          <Button className="mt-4 w-full" onClick={onStart}>
            <Play className="h-4 w-4" /> Iniciar
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}

// ---------------------------------------------------------------------------
// MockScoresCard
// ---------------------------------------------------------------------------

const SCORE_COLOR = (score: number) =>
  score >= 75
    ? 'text-emerald-500'
    : score >= 60
      ? 'text-amber-500'
      : 'text-red-500'

function MockScoresCard({
  mockScores,
  onLog,
  onClear,
}: {
  mockScores: MockScore[]
  onLog: (score: number) => void
  onClear: () => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const latest = mockScores.at(-1)

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Simulados
            </CardTitle>
            {mockScores.length > 0 && (
              <button
                onClick={onClear}
                title="Limpar histórico"
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Limpar histórico de simulados">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <CardDescription>
            {mockScores.length === 0
              ? 'Nenhum simulado registrado ainda.'
              : `${mockScores.length} simulado${mockScores.length > 1 ? 's' : ''} registrado${mockScores.length > 1 ? 's' : ''}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Score history list — show last 3 */}
          {mockScores.length > 0 && (
            <ul className="space-y-1.5">
              {mockScores
                .slice(-3)
                .reverse()
                .map((entry, i) => (
                  <li
                    key={`${entry.date}-${i}`}
                    className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-1.5 text-sm">
                    <span className="text-muted-foreground">{entry.label}</span>
                    <span
                      className={cn(
                        'font-semibold tabular-nums',
                        SCORE_COLOR(entry.score),
                      )}>
                      {entry.score}%
                    </span>
                  </li>
                ))}
            </ul>
          )}

          {/* Target indicator */}
          {latest && (
            <div className="rounded-md border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
              Aprovação:{' '}
              <span className="font-medium text-foreground">75%</span>
              {' · '}
              {latest.score >= 75 ? (
                <span className="text-emerald-500 font-medium">Aprovado ✓</span>
              ) : (
                <span>
                  faltam{' '}
                  <span className="font-medium text-foreground">
                    {75 - latest.score} pontos
                  </span>
                </span>
              )}
            </div>
          )}

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={() => setDialogOpen(true)}>
            + Registrar simulado
          </Button>
        </CardContent>
      </Card>

      <MockScoreDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={onLog}
      />
    </>
  )
}
