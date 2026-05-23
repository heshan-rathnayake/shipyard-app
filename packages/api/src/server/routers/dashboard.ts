import { z } from "zod";
import { requireMembership } from "../../lib/membership";
import { protectedProcedure, router } from "../trpc";

// Roles that can see org-wide data (activity feed, priority breakdown)
const PRIVILEGED_ROLES = new Set(["OWNER", "ADMIN"]);

export const dashboardRouter = router({
  getStats: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Any org member can view the dashboard
      const member = await requireMembership(
        ctx.db,
        ctx.session.user.id,
        input.orgId
      );

      const isPrivileged = PRIVILEGED_ROLES.has(member.role);

      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const sevenDaysFromNow = new Date(
        now.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      // All project IDs for this org (including archived — for accurate task counts)
      const allProjectIds = await ctx.db.project
        .findMany({
          where: { organizationId: input.orgId },
          select: { id: true },
        })
        .then((ps) => ps.map((p) => p.id));

      const [
        totalTasks,
        addedThisWeek,
        inProgressRows,
        completedThisWeek,
        overdue,
        recentProjects,
        myTasks,
        recentActivity,
        priorityBreakdown,
      ] = await Promise.all([
        // 1. Total tasks across all org projects
        ctx.db.task.count({
          where: { projectId: { in: allProjectIds } },
        }),

        // 2. Tasks created in the last 7 days
        ctx.db.task.count({
          where: {
            projectId: { in: allProjectIds },
            createdAt: { gte: sevenDaysAgo },
          },
        }),

        // 3. In-progress tasks — fetch rows so we can count unique projects
        ctx.db.task.findMany({
          where: {
            projectId: { in: allProjectIds },
            status: "IN_PROGRESS",
          },
          select: { projectId: true },
        }),

        // 4. Tasks completed this week
        ctx.db.task.count({
          where: {
            projectId: { in: allProjectIds },
            status: "DONE",
            updatedAt: { gte: sevenDaysAgo },
          },
        }),

        // 5. Overdue tasks (due date passed, not done/cancelled)
        ctx.db.task.count({
          where: {
            projectId: { in: allProjectIds },
            dueDate: { lt: now },
            status: { notIn: ["DONE", "CANCELLED"] },
          },
        }),

        // 6. Recent active projects with task/member data
        ctx.db.project.findMany({
          where: {
            organizationId: input.orgId,
            status: { not: "ARCHIVED" },
          },
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: {
            id: true,
            name: true,
            status: true,
            updatedAt: true,
            tasks: {
              select: {
                status: true,
                dueDate: true,
                assignee: {
                  select: {
                    id: true,
                    user: { select: { name: true, image: true } },
                  },
                },
              },
            },
          },
        }),

        // 7. Tasks assigned to the current member (not done/cancelled)
        ctx.db.task.findMany({
          where: {
            projectId: { in: allProjectIds },
            assigneeId: member.id,
            status: { notIn: ["DONE", "CANCELLED"] },
          },
          orderBy: { dueDate: { sort: "asc", nulls: "last" } },
          take: 8,
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            project: { select: { id: true, name: true } },
          },
        }),

        // 8. Activity feed:
        //    OWNER/ADMIN → full org activity
        //    MEMBER/VIEWER → scoped to their own actions only
        ctx.db.activityLog.findMany({
          where: {
            organizationId: input.orgId,
            ...(isPrivileged ? {} : { memberId: member.id }),
          },
          orderBy: { createdAt: "desc" },
          take: 8,
          select: {
            id: true,
            action: true,
            entityType: true,
            metadata: true,
            createdAt: true,
            member: {
              select: {
                user: { select: { name: true, image: true } },
              },
            },
          },
        }),

        // 9. Open task count by priority:
        //    OWNER/ADMIN → org-wide breakdown
        //    VIEWER → skipped (null returned, panel hidden on client)
        member.role === "VIEWER"
          ? Promise.resolve(null)
          : ctx.db.task.groupBy({
              by: ["priority"],
              where: {
                projectId: { in: allProjectIds },
                status: { notIn: ["DONE", "CANCELLED"] },
              },
              _count: { id: true },
            }),
      ]);

      // Derive in-progress stats
      const inProgressProjectIds = new Set(
        inProgressRows.map((r) => r.projectId)
      );

      // Sort projects: ones where the current member has a task come first,
      // preserving the updatedAt order within each group.
      const sortedProjects = [...recentProjects].sort((a, b) => {
        const aHasTask = a.tasks.some((t) => t.assignee?.id === member.id);
        const bHasTask = b.tasks.some((t) => t.assignee?.id === member.id);
        if (aHasTask && !bHasTask) return -1;
        if (!aHasTask && bHasTask) return 1;
        return 0;
      });

      // Process recent projects into a clean shape
      const projects = sortedProjects.map((p) => {
        const total = p.tasks.length;
        const done = p.tasks.filter((t) => t.status === "DONE").length;
        const dueSoon = p.tasks.filter(
          (t) =>
            t.dueDate != null &&
            t.dueDate >= now &&
            t.dueDate <= sevenDaysFromNow &&
            t.status !== "DONE" &&
            t.status !== "CANCELLED"
        ).length;

        // Unique assignee avatars (up to 4 visible + overflow count)
        const seen = new Set<string>();
        const members: { name: string | null; image: string | null }[] = [];
        for (const task of p.tasks) {
          if (task.assignee && !seen.has(task.assignee.id)) {
            seen.add(task.assignee.id);
            members.push(task.assignee.user);
          }
        }

        return {
          id: p.id,
          name: p.name,
          status: p.status,
          updatedAt: p.updatedAt.toISOString(),
          tasksDone: done,
          tasksTotal: total,
          dueSoon,
          members: members.slice(0, 4),
          extraMemberCount: Math.max(0, members.length - 4),
        };
      });

      // Build priority map — null when skipped for VIEWER
      const priorityBreakdown_: Record<string, number> | null =
        priorityBreakdown === null
          ? null
          : { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };

      if (priorityBreakdown !== null && priorityBreakdown_ !== null) {
        for (const g of priorityBreakdown) {
          priorityBreakdown_[g.priority] = g._count.id;
        }
      }

      return {
        role: member.role,
        // activityScoped: true when the feed is the member's own actions only
        activityScoped: !isPrivileged,
        stats: {
          totalTasks,
          addedThisWeek,
          inProgress: inProgressRows.length,
          inProgressProjects: inProgressProjectIds.size,
          completedThisWeek,
          overdue,
        },
        projects,
        myTasks: myTasks.map((t) => ({
          ...t,
          dueDate: t.dueDate?.toISOString() ?? null,
        })),
        recentActivity: recentActivity.map((a) => ({
          ...a,
          createdAt: a.createdAt.toISOString(),
        })),
        // null → panel is hidden on the client
        priorityBreakdown: priorityBreakdown_,
      };
    }),
});
