"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shipyard/ui/components/avatar";
import { Skeleton } from "@shipyard/ui/components/skeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ActivityEntry {
  id: string;
  action: string;
  entityType: string;
  metadata: unknown;
  createdAt: string;
  member: {
    user: { name: string | null; image: string | null };
  };
}

type Meta = Record<string, string>;

function formatAction(action: string, meta: Meta): string {
  const title = meta.title ?? meta.name ?? null;
  const quoted = title ? `"${title}"` : "an item";

  switch (action) {
    case "TASK_CREATED":
      return `created ${quoted}`;
    case "TASK_UPDATED":
      return `updated ${quoted}`;
    case "TASK_STATUS_UPDATED": {
      const to = meta.to ?? "";
      if (to === "DONE") return `completed ${quoted}`;
      const label = to.replace("_", " ").toLowerCase();
      return `moved ${quoted} to ${label}`;
    }
    case "TASK_ASSIGNED":
      return `assigned ${quoted}`;
    case "TASK_DELETED":
      return `deleted ${quoted}`;
    case "COMMENT_CREATED":
      return "commented on a task";
    case "COMMENT_DELETED":
      return "deleted a comment";
    case "PROJECT_CREATED":
      return `created project ${quoted}`;
    case "PROJECT_UPDATED":
      return `updated project ${quoted}`;
    case "PROJECT_ARCHIVED":
      return `archived project ${quoted}`;
    case "PROJECT_UNARCHIVED":
      return `unarchived project ${quoted}`;
    case "PROJECT_DELETED":
      return `deleted project ${quoted}`;
    case "MEMBER_INVITED":
      return "invited a new member";
    case "MEMBER_REMOVED":
      return "removed a member";
    case "MEMBER_ROLE_UPDATED":
      return "updated a member's role";
    case "INVITATION_ACCEPTED":
      return "joined the organization";
    case "INVITATION_CANCELLED":
      return "cancelled an invitation";
    case "ORG_UPDATED":
      return "updated organization settings";
    default:
      return action.toLowerCase().replace(/_/g, " ");
  }
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function UserAvatar({
  name,
  image,
}: {
  name: string | null;
  image: string | null;
}) {
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <Avatar className="size-8 shrink-0">
      <AvatarImage src={image ?? ""} alt={name ?? "User"} />
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  );
}

export function RecentActivity({
  entries,
  orgSlug,
  scoped = false,
}: {
  entries: ActivityEntry[];
  orgSlug: string;
  /** true → MEMBER/VIEWER seeing only their own actions */
  scoped?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="font-semibold">
            {scoped ? "My Activity" : "Recent Activity"}
          </h2>
          {scoped && (
            <p className="text-[11px] text-muted-foreground">
              Your actions in this org
            </p>
          )}
        </div>
        <Link
          href={`/${orgSlug}/activity`}
          className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all <ArrowRight className="size-3" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted-foreground">
          No activity yet.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map((entry) => {
            const meta = (entry.metadata ?? {}) as Meta;
            const actor = entry.member.user.name ?? "Someone";
            const action = formatAction(entry.action, meta);

            return (
              <li key={entry.id} className="flex gap-3 px-5 py-3.5">
                <UserAvatar
                  name={entry.member.user.name}
                  image={entry.member.user.image}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">
                    <span className="font-semibold">{actor}</span> {action}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {timeAgo(entry.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function RecentActivitySkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <ul className="divide-y divide-border">
        {[1, 2, 3, 4, 5].map((n) => (
          <li key={n} className="flex gap-3 px-5 py-3.5">
            <Skeleton className="size-8 rounded-full shrink-0" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-16" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
