import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import { ORG_OWNER_LIMITS } from "../../config/plans";
import { requireMembership } from "../../lib/membership";
import { logActivity, ActivityAction, EntityType } from "../../lib/activityLog";

// Converts a display name to a URL-safe slug
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const organizationRouter = router({
  getMyOrgs: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.member.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        role: true,
        joinedAt: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            subscriptionTier: true,
            createdAt: true,
            _count: { select: { members: true, projects: true } },
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2, "Name must be at least 2 characters").max(50),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Enforce per-tier ownership limit
      const ownedCount = await ctx.db.member.count({
        where: { userId: ctx.session.user.id, role: "OWNER" },
      });

      if (ownedCount >= ORG_OWNER_LIMITS.FREE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Free plan is limited to 1 organization. Upgrade to Pro to create more.",
        });
      }

      const baseSlug = toSlug(input.name);

      if (!baseSlug) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Name must contain at least one valid character.",
        });
      }

      // These slugs conflict with top-level Next.js routes
      const RESERVED_SLUGS = new Set([
        "dashboard", "settings", "login", "signup", "register",
        "invite", "api", "org", "admin", "auth",
      ]);
      if (RESERVED_SLUGS.has(baseSlug)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `"${baseSlug}" is a reserved name. Please choose a different organization name.`,
        });
      }

      // Append a short random suffix only when the base slug is already taken
      const existing = await ctx.db.organization.findUnique({
        where: { slug: baseSlug },
        select: { id: true },
      });

      const slug = existing
        ? `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`
        : baseSlug;

      const org = await ctx.db.organization.create({
        data: {
          name: input.name,
          slug,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "OWNER",
            },
          },
        },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });

      // Look up the new member record for the audit log
      const callerMember = await ctx.db.member.findUnique({
        where: {
          userId_organizationId: {
            userId: ctx.session.user.id,
            organizationId: org.id,
          },
        },
        select: { id: true },
      });
      if (callerMember) {
        void logActivity({
          db: ctx.db,
          orgId: org.id,
          memberId: callerMember.id,
          action: ActivityAction.ORG_CREATED,
          entityType: EntityType.ORGANIZATION,
          entityId: org.id,
          metadata: { name: input.name },
        });
      }

      return org;
    }),

  delete: protectedProcedure
    .input(z.object({ orgId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const membership = await requireMembership(
        ctx.db,
        ctx.session.user.id,
        input.orgId,
      );

      if (membership.role !== "OWNER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only organization owners can delete the organization.",
        });
      }

      // No audit log — cascade delete removes all ActivityLog rows anyway
      await ctx.db.organization.delete({
        where: { id: input.orgId },
      });

      return { success: true };
    }),
});
