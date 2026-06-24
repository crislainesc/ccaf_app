import { CheckCircle2, Clock3, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { courses, type ScheduleDay } from "@/data/studyPlan";

type SchedulePageProps = {
  schedule: ScheduleDay[];
  activities: Record<string, boolean>;
  onToggleActivity: (id: string) => void;
};

export function SchedulePage({
  schedule,
  activities,
  onToggleActivity,
}: SchedulePageProps) {
  // Map courseId → url once rather than on every activity render
  const courseLinks = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.id, c.url])),
    [],
  );

  if (schedule.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center text-muted-foreground">
        Nenhum cronograma gerado.
      </div>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {schedule.map((day) => (
        <DayCard
          key={day.id}
          day={day}
          activities={activities}
          courseLinks={courseLinks}
          onToggleActivity={onToggleActivity}
        />
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// DayCard
// ---------------------------------------------------------------------------

type DayCardProps = {
  day: ScheduleDay;
  activities: Record<string, boolean>;
  courseLinks: Record<string, string>;
  onToggleActivity: (id: string) => void;
};

function DayCard({ day, activities, courseLinks, onToggleActivity }: DayCardProps) {
  const completed =
    day.activities.length > 0 && day.activities.every((a) => activities[a.id]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>{day.label}</CardTitle>
          <CardDescription>{day.theme}</CardDescription>
        </div>
        {completed && (
          <Badge variant="success">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
            DIA CONCLUÍDO
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {day.activities.map((activity) => {
          const url =
            activity.url ??
            (activity.courseId ? courseLinks[activity.courseId] : undefined);

          return (
            <div key={activity.id} className="rounded-md border p-3">
              <label className="flex items-start gap-3">
                <input
                  className="mt-1 h-5 w-5 accent-primary"
                  type="checkbox"
                  checked={Boolean(activities[activity.id])}
                  onChange={() => onToggleActivity(activity.id)}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{activity.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                      {activity.estimatedMinutes} min
                    </span>
                    <span>{activity.notes}</span>
                  </span>
                </span>
              </label>
              {url && (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Abrir curso
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
