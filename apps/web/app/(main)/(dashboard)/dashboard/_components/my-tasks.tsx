"use client";

import { Skeleton } from "@shipyard/ui/components/skeleton";
import { ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface MyTask {
  id: string;
  title: string;
  priority: Priority;
  dueDate: string | null;
  project: { id: string; name: string };
}

const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: "border border-border text-muted-foreground",
  MEDIUM: "bg-secondary text-secondary-foreground",
  HIGH: "bg-primary/15 text-primary",
  URGENT: "bg-destructive/15 text-destructive",
};

function isOverdue(iso: string | null) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

function formatDue(iso: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function MyTasks({
  tasks,
  orgSlug,
}: {
  tasks: MyTask[];
  orgSlug: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold">My Tasks</h2>
        <Link
          href={`/${orgSlug}/projects`}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No open tasks assigned to you.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {tasks.map((task) => {
            const overdue = isOverdue(task.dueDate);
            const due = formatDue(task.dueDate);
            return (
              <li key={task.id} className="flex items-center gap-3 px-5 py-3">
                {/* Checkbox placeholder */}
                <span className="size-4 shrink-0 rounded border border-border" />

                <span className="min-w-0 flex-1 text-sm leading-snug line-clamp-1">
                  {task.title}
                </span>

                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_STYLES[task.priority]}`}
                  >
                    {task.priority.charAt(0) +
                      task.priority.slice(1).toLowerCase()}
                  </span>
                  {due && (
                    <span
                      className={`flex items-center gap-0.5 text-[11px] ${overdue ? "font-medium text-destructive" : "text-muted-foreground"}`}
                    >
                      <CalendarDays className="size-3" />
                      {due}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function MyTasksSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-12" />
      </div>
      <ul className="divide-y divide-border">
        {[1, 2, 3, 4].map((n) => (
          <li key={n} className="flex items-center gap-3 px-5 py-3">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-5 w-14 rounded" />
          </li>
        ))}
      </ul>
    </div>
  );
}
