"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shipyard/ui/components/avatar";
import { Skeleton } from "@shipyard/ui/components/skeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProjectMember {
  name: string | null;
  image: string | null;
}

interface RecentProject {
  id: string;
  name: string;
  status: string;
  updatedAt: string;
  tasksDone: number;
  tasksTotal: number;
  dueSoon: number;
  members: ProjectMember[];
  extraMemberCount: number;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function MemberAvatar({ member }: { member: ProjectMember }) {
  const initials = (member.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar className="size-7 border-2 border-background">
      <AvatarImage src={member.image ?? ""} alt={member.name ?? "Member"} />
      <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
    </Avatar>
  );
}

export function RecentProjects({
  projects,
  orgSlug,
}: {
  projects: RecentProject[];
  orgSlug: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="font-semibold">Recent Projects</h2>
        <Link
          href={`/${orgSlug}/projects`}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No active projects yet.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {projects.map((project) => {
            const pct =
              project.tasksTotal > 0
                ? Math.round((project.tasksDone / project.tasksTotal) * 100)
                : 0;

            return (
              <li key={project.id} className="group px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/${orgSlug}/projects`}
                      className="truncate text-sm font-semibold hover:underline"
                    >
                      {project.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Updated {timeAgo(project.updatedAt)}
                    </p>
                  </div>
                  {project.dueSoon > 0 && (
                    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      {project.dueSoon} due soon
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="mb-1 flex justify-end">
                    <span className="text-[11px] text-muted-foreground">
                      {project.tasksDone}/{project.tasksTotal}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Member avatars */}
                {project.members.length > 0 && (
                  <div className="mt-3 flex -space-x-2">
                    {project.members.map((m, i) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: static per-project member slots
                      <MemberAvatar key={i} member={m} />
                    ))}
                    {project.extraMemberCount > 0 && (
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                        +{project.extraMemberCount}
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function RecentProjectsSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <ul className="divide-y divide-border">
        {[1, 2, 3].map((n) => (
          <li key={n} className="px-5 py-4 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-1.5 w-full rounded-full" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map((a) => (
                <Skeleton key={a} className="size-7 rounded-full" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
