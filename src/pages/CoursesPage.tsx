import { ExternalLink } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Metric } from "@/components/shared/Metric";
import { STATUS_LABELS, type CourseWithProgress } from "@/types/study";

type CoursesPageProps = {
  courseProgress: CourseWithProgress[];
  checklist: Record<string, boolean>;
  notes: Record<string, string>;
  onToggleChecklist: (courseId: string, item: string) => void;
  onUpdateNote: (courseId: string, value: string) => void;
};

export function CoursesPage({
  courseProgress,
  checklist,
  notes,
  onToggleChecklist,
  onUpdateNote,
}: CoursesPageProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      {courseProgress.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          checklist={checklist}
          note={notes[course.id] ?? ""}
          onToggleChecklist={onToggleChecklist}
          onUpdateNote={onUpdateNote}
        />
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// CourseCard
// ---------------------------------------------------------------------------

type CourseCardProps = {
  course: CourseWithProgress;
  checklist: Record<string, boolean>;
  note: string;
  onToggleChecklist: (courseId: string, item: string) => void;
  onUpdateNote: (courseId: string, value: string) => void;
};

function CourseCard({
  course,
  checklist,
  note,
  onToggleChecklist,
  onUpdateNote,
}: CourseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="leading-snug">{course.name}</CardTitle>
            <CardDescription className="mt-2">{course.description}</CardDescription>
          </div>
          <Badge
            variant={
              course.status === "completed"
                ? "success"
                : course.status === "in-progress"
                  ? "warning"
                  : "secondary"
            }
          >
            {STATUS_LABELS[course.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Importância" value={"★".repeat(course.importance)} />
          <Metric label="Tempo estimado" value={`${course.estimatedMinutes} min`} />
          <Metric label="Checklist" value={`${course.done}/${course.checklist.length}`} />
        </div>

        <Progress value={course.progress} />

        <div className="grid gap-2">
          {course.checklist.map((item) => (
            <label
              key={item}
              className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm"
            >
              <input
                className="h-5 w-5 accent-primary"
                type="checkbox"
                checked={Boolean(checklist[`${course.id}:${item}`])}
                onChange={() => onToggleChecklist(course.id, item)}
              />
              <span>{item}</span>
            </label>
          ))}
        </div>

        <Textarea
          placeholder="Notas pessoais e observações"
          value={note}
          onChange={(e) => onUpdateNote(course.id, e.target.value)}
        />

        <Button
          variant={course.url ? "default" : "secondary"}
          disabled={!course.url}
          onClick={() =>
            course.url && window.open(course.url, "_blank", "noopener,noreferrer")
          }
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Abrir Curso
        </Button>
      </CardContent>
    </Card>
  );
}
