import { GraduationCap, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type AppHeaderProps = {
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function AppHeader({ theme, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm text-muted-foreground">
              Claude Certified Architect Foundation
            </p>
            <h1 className="truncate text-lg font-semibold">CCAF Sprint</h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleTheme}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}
