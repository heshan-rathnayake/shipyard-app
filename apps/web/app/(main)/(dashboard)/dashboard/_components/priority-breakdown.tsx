import { Skeleton } from "@shipyard/ui/components/skeleton";

interface PriorityBreakdownProps {
  counts: Record<string, number>;
}

const PRIORITIES = [
  {
    key: "URGENT",
    label: "Urgent",
    bg: "bg-destructive/15",
    text: "text-destructive",
  },
  { key: "HIGH", label: "High", bg: "bg-primary/15", text: "text-primary" },
  {
    key: "MEDIUM",
    label: "Medium",
    bg: "bg-secondary",
    text: "text-secondary-foreground",
  },
  { key: "LOW", label: "Low", bg: "bg-muted", text: "text-muted-foreground" },
] as const;

export function PriorityBreakdown({ counts }: PriorityBreakdownProps) {
  const total = Object.values(counts).reduce((s, v) => s + v, 0);

  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Open Tasks by Priority</h2>
        <span className="text-xs text-muted-foreground">{total} open</span>
      </div>

      {total === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No open tasks.
        </p>
      ) : (
        <>
          {/* Stacked bar */}
          <div className="flex h-2.5 w-full overflow-hidden rounded-full">
            {PRIORITIES.map(({ key, bg }) => {
              const pct = total > 0 ? ((counts[key] ?? 0) / total) * 100 : 0;
              return pct > 0 ? (
                <div
                  key={key}
                  className={`h-full ${bg} first:rounded-l-full last:rounded-r-full`}
                  style={{ width: `${pct}%` }}
                />
              ) : null;
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            {PRIORITIES.map(({ key, label, bg, text }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-sm ${bg}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <span className={`text-xs font-semibold ${text}`}>
                  {counts[key] ?? 0}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function PriorityBreakdownSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-4">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-2.5 w-full rounded-full" />
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
