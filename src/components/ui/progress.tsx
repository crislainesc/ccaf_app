import { cn, clamp } from "@/lib/utils";

type ProgressProps = {
  value: number;
  className?: string;
  indicatorClassName?: string;
};

export function Progress({ value, className, indicatorClassName }: ProgressProps) {
  return (
    <div className={cn("h-2.5 w-full overflow-hidden rounded-full bg-secondary", className)} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full bg-primary transition-all", indicatorClassName)} style={{ width: `${clamp(value)}%` }} />
    </div>
  );
}
