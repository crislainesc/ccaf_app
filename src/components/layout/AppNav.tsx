import { BookOpen, CalendarDays, TimerReset } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tab } from "@/types/study";

type NavItem = {
  id: Tab;
  label: string;
  icon: React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: <TimerReset className="h-4 w-4" /> },
  { id: "schedule", label: "Cronograma", icon: <CalendarDays className="h-4 w-4" /> },
  { id: "courses", label: "Cursos", icon: <BookOpen className="h-4 w-4" /> },
];

type AppNavProps = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function AppNav({ activeTab, onTabChange }: AppNavProps) {
  return (
    <nav
      className="sticky top-[65px] z-20 border-b bg-background/92 backdrop-blur"
      aria-label="Navegação principal"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-3 sm:px-6">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            aria-current={activeTab === item.id ? "page" : undefined}
            className={cn(
              "flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium transition-colors",
              activeTab === item.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-card hover:bg-accent",
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
