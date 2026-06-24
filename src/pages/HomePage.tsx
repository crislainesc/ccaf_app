import { Play, RotateCcw, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Metric } from "@/components/shared/Metric";
import { courses } from "@/data/studyPlan";
import { cn } from "@/lib/utils";
import type { Countdown, CourseWithProgress, Totals } from "@/types/study";
import { STATUS_LABELS } from "@/types/study";

const URGENCY_CLASS: Record<string, string> = {
  danger: "from-red-600 to-rose-500 text-white",
  orange: "from-orange-500 to-red-500 text-white",
  yellow: "from-amber-400 to-yellow-500 text-slate-950",
  calm: "from-cyan-500 to-emerald-500 text-slate-950",
};

type HomePageProps = {
  totals: Totals;
  countdown: Countdown;
  nextCourse: CourseWithProgress;
  onStart: () => void;
  onReset: () => void;
};

export function HomePage({
  totals,
  countdown,
  nextCourse,
  onStart,
  onReset,
}: HomePageProps) {
  return (
    <div className="space-y-5">
      <CountdownBanner countdown={countdown} onReset={onReset} />
      <StatsGrid totals={totals} nextCourse={nextCourse} onStart={onStart} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CountdownBanner
// ---------------------------------------------------------------------------

function CountdownBanner({
  countdown,
  onReset,
}: {
  countdown: Countdown;
  onReset: () => void;
}) {
  return (
    <section
      className={cn(
        "rounded-lg bg-gradient-to-br p-5 shadow-app sm:p-6",
        URGENCY_CLASS[countdown.urgency],
      )}
    >
      <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold uppercase tracking-normal opacity-80">
              Prova em {countdown.examLabel}
            </p>
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-md border border-current/30 px-2 py-1 text-xs font-medium opacity-80 transition-opacity hover:opacity-100"
              title="Alterar data da prova"
            >
              <RotateCcw className="h-3 w-3" />
              Alterar data
            </button>
          </div>
          <h2 className="mt-2 text-4xl font-bold sm:text-5xl">
            {countdown.days} dias
          </h2>
          <p className="mt-2 text-lg font-medium">
            {countdown.hours}h e {countdown.minutes}min restantes
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
  );
}

// ---------------------------------------------------------------------------
// StatsGrid
// ---------------------------------------------------------------------------

function StatsGrid({
  totals,
  nextCourse,
  onStart,
}: {
  totals: Totals;
  nextCourse: CourseWithProgress;
  onStart: () => void;
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

      {/* Goal targets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" /> Meta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Metric label="Simulado atual" value="80%" />
          <Metric label="Antes da prova" value="85%" />
        </CardContent>
      </Card>

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
  );
}
