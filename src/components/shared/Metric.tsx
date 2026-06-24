type MetricProps = {
  label: string;
  value: string;
};

/**
 * Small stat tile used in dashboard cards.
 */
export function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-md border bg-muted/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
