import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { db } from "@shipyard/db";

interface RedirectOptions {
  /** Redirect when the user is not authenticated. Default: "/login" */
  unauthenticated?: string;
  /** Redirect when the user is not a member of the org. Default: "/dashboard" */
  notMember?: string;
}

/**
 * Verifies the current user is authenticated and is a member of the given org.
 * Redirects on failure; returns session + membership (role + org name) on success.
 */
export async function requireOrgMembership(
  orgId: string,
  redirects?: RedirectOptions,
) {
  const session = await auth();
  if (!session) redirect(redirects?.unauthenticated ?? "/login");

  const membership = await db.member.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId: orgId },
    },
    select: {
      role: true,
      organization: { select: { name: true } },
    },
  });

  if (!membership) redirect(redirects?.notMember ?? "/dashboard");

  return { session, membership };
}
