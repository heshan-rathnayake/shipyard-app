"use client";

import { Activity, CheckCircle2, CircleAlert, ListTodo } from "lucide-react";
import { trpc } from "@/src/providers/trpc-react-provider";
import { useOrgStore } from "@/src/stores/org-store";
import { MyTasks, MyTasksSkeleton } from "./my-tasks";
import {
  PriorityBreakdown,
  PriorityBreakdownSkeleton,
} from "./priority-breakdown";
import { RecentActivity, RecentActivitySkeleton } from "./recent-activity";
import { RecentProjects, RecentProjectsSkeleton } from "./recent-projects";
import { StatCard, StatCardSkeleton } from "./stat-card";

interface Membership {
  role: string;
  orgId: string;
  orgName: string;
  orgSlug: string;
}

export function DashboardContent({
  memberships,
}: {
  memberships: Membership[];
}) {
  const activeSlug = useOrgStore((s) => s.activeOrgSlug);

  // Resolve which org to show — active store slug wins, else first membership
  const activeMembership =
    memberships.find((m) => m.orgSlug === activeSlug) ?? memberships[0];

  if (!activeMembership) return null;

  return (
    <DashboardData
      orgId={activeMembership.orgId}
      orgName={activeMembership.orgName}
      orgSlug={activeMembership.orgSlug}
    />
  );
}

function DashboardData({
  orgId,
  orgName,
  orgSlug,
}: {
  orgId: string;
  orgName: string;
  orgSlug: string;
}) {
  const { data, isLoading } = trpc.dashboard.getStats.useQuery(
    { orgId },
    { staleTime: 30_000 }
  );

  // Priority breakdown is null for VIEWERs — panel is hidden entirely
  const showPriorityBreakdown = isLoading || data?.priorityBreakdown !== null;

  return (
    <>
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{orgName}</p>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Tasks"
              value={data.stats.totalTasks}
              subtitle={
                data.stats.addedThisWeek > 0
                  ? `↑ ${data.stats.addedThisWeek} added this week`
                  : "No new tasks this week"
              }
              icon={ListTodo}
              iconClassName="text-muted-foreground"
            />
            <StatCard
              label="In Progress"
              value={data.stats.inProgress}
              subtitle={
                data.stats.inProgressProjects > 0
                  ? `across ${data.stats.inProgressProjects} project${data.stats.inProgressProjects !== 1 ? "s" : ""}`
                  : "No tasks in progress"
              }
              icon={Activity}
              iconClassName="text-primary"
            />
            <StatCard
              label="Completed"
              value={data.stats.completedThisWeek}
              subtitle="this week"
              icon={CheckCircle2}
              iconClassName="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              label="Overdue"
              value={data.stats.overdue}
              subtitle={
                data.stats.overdue > 0 ? "needs attention" : "all on track"
              }
              icon={CircleAlert}
              iconClassName={
                data.stats.overdue > 0
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            />
          </>
        )}
      </div>

      {/* ── Main content grid ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Recent Projects — wider column */}
        <div className="lg:col-span-3">
          {isLoading || !data ? (
            <RecentProjectsSkeleton />
          ) : (
            <RecentProjects projects={data.projects} orgSlug={orgSlug} />
          )}
        </div>

        {/* Right column — Priority Breakdown (role-gated) + My Tasks + Activity */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {isLoading || !data ? (
            <>
              {showPriorityBreakdown && <PriorityBreakdownSkeleton />}
              <MyTasksSkeleton />
              <RecentActivitySkeleton />
            </>
          ) : (
            <>
              {/* VIEWER role: priorityBreakdown is null → panel hidden */}
              {data.priorityBreakdown !== null && (
                <PriorityBreakdown counts={data.priorityBreakdown} />
              )}
              <MyTasks tasks={data.myTasks} orgSlug={orgSlug} />
              {/* activityScoped: MEMBER/VIEWER see only their own actions */}
              <RecentActivity
                entries={data.recentActivity}
                orgSlug={orgSlug}
                scoped={data.activityScoped}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
