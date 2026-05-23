import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <span
          className={`flex size-8 items-center justify-center rounded-lg ${iconClassName ?? "bg-muted"}`}
        >
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-4xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="size-8 rounded-lg bg-muted" />
      </div>
      <div className="mt-3 h-9 w-16 rounded bg-muted" />
      <div className="mt-1 h-3 w-28 rounded bg-muted" />
    </div>
  );
}
