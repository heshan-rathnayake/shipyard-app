import { TRPCError } from "@trpc/server";
import type { PrismaClient } from "@shipyard/db";
import { MemberRole } from "@shipyard/db/enum";

/** Assert caller is a member of the org and return their membership. */
export async function requireMembership(
  db: PrismaClient,
  userId: string,
  orgId: string,
) {
  const membership = await db.member.findUnique({
    where: { userId_organizationId: { userId, organizationId: orgId } },
    select: { id: true, role: true },
  });
  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization.",
    });
  }
  return membership;
}

/** Assert caller is OWNER or ADMIN. */
export function requireManagerRole(role: MemberRole) {
  if (role !== MemberRole.OWNER && role !== MemberRole.ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only owners and admins can perform this action.",
    });
  }
}
