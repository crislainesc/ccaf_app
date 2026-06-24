import { Play, Settings } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseLocalDate, todayISO } from "@/lib/dateUtils";

type SetupPageProps = {
  onConfirm: (examDate: string) => void;
};

export function SetupPage({ onConfirm }: SetupPageProps) {
  const today = todayISO();
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const daysAvailable = useMemo(() => {
    if (!date) return null;
    const diff = parseLocalDate(date).getTime() - parseLocalDate(today).getTime();
    return Math.floor(diff / 86_400_000) + 1;
  }, [date, today]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) {
      setError("Selecione uma data.");
      return;
    }
    if (parseLocalDate(date) < parseLocalDate(today)) {
      setError("A data da prova deve ser hoje ou no futuro.");
      return;
    }
    onConfirm(date);
  }

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Settings className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Configurar plano de estudos</CardTitle>
          <CardDescription>
            Informe a data da sua prova. O app vai distribuir todos os cursos e
            atividades automaticamente entre hoje e o dia do exame.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="exam-date" className="text-sm font-medium">
                Data da prova
              </label>
              <input
                id="exam-date"
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setError("");
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {error && (
                <p className="text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>

            {daysAvailable !== null && (
              <div className="rounded-md border bg-muted/40 p-3 text-sm">
                <span className="font-semibold text-primary">{daysAvailable}</span>{" "}
                {daysAvailable === 1 ? "dia disponível" : "dias disponíveis"} —{" "}
                {daysAvailable < 3
                  ? "Modo intensivo: todos os cursos comprimidos."
                  : daysAvailable < 7
                    ? "Plano curto: cursos + revisão rápida."
                    : "Plano completo: cursos, revisões e simulados."}
              </div>
            )}

            <Button type="submit" className="w-full">
              <Play className="h-4 w-4" />
              Gerar plano de estudos
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
