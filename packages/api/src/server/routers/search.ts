import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { requireMembership } from "../../lib/membership";
import { protectedProcedure, router } from "../trpc";

export const searchRouter = router({
  global: protectedProcedure
    .input(
      z.object({
        // Optional — when absent, only orgs are searched
        orgSlug: z.string().optional(),
        query: z.string().min(1).max(100),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orgSlug, query } = input;

      // Split into individual words so "launch q3" matches "Q3 Launch Plan"
      const words = query.trim().split(/\s+/).filter(Boolean);

      // Orgs are always searched across all the caller's memberships
      const orgsPromise = ctx.db.organization.findMany({
        where: {
          members: { some: { userId: ctx.session.user.id } },
          AND: words.map((w) => ({
            name: { contains: w, mode: "insensitive" },
          })),
        },
        select: { id: true, name: true, slug: true },
        take: 5,
        orderBy: { name: "asc" },
      });

      // Projects + members are only searched when an org context is provided
      if (!orgSlug) {
        const orgs = await orgsPromise;
        return { orgs, projects: [], members: [] };
      }

      const org = await ctx.db.organization.findUnique({
        where: { slug: orgSlug },
        select: { id: true },
      });

      if (!org) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Organization not found.",
        });
      }

      await requireMembership(ctx.db, ctx.session.user.id, org.id);

      const [orgs, projects, members] = await Promise.all([
        orgsPromise,
        ctx.db.project.findMany({
          where: {
            organizationId: org.id,
            status: { not: "ARCHIVED" },
            AND: words.map((w) => ({
              name: { contains: w, mode: "insensitive" },
            })),
          },
          select: { id: true, name: true, status: true },
          take: 5,
          orderBy: { name: "asc" },
        }),
        ctx.db.member.findMany({
          where: {
            organizationId: org.id,
            AND: words.map((w) => ({
              OR: [
                { user: { name: { contains: w, mode: "insensitive" } } },
                { user: { email: { contains: w, mode: "insensitive" } } },
              ],
            })),
          },
          select: {
            user: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          take: 5,
          orderBy: { joinedAt: "asc" },
        }),
      ]);

      return {
        orgs,
        projects,
        members: members.map((m) => m.user),
      };
    }),
});
