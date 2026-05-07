import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/server/auth";
import { db } from "@shipyard/db";
import { MemberRole } from "@shipyard/db/enum";
import { Separator } from "@shipyard/ui/components/separator";
import { InviteMemberDialog } from "./_components/invite-member-dialog";
import { MemberList } from "./_components/member-list";
import { PendingInvitations } from "./_components/pending-invitations";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;

  const session = await auth();
  if (!session) redirect("/login");

  // Verify caller is a member and get their role
  const callerMembership = await db.member.findUnique({
    where: {
      userId_organizationId: { userId: session.user.id, organizationId: orgId },
    },
    select: {
      role: true,
      organization: { select: { name: true } },
    },
  });

  if (!callerMembership) redirect("/dashboard");

  const { role: callerRole, organization } = callerMembership;
  const canManage =
    callerRole === MemberRole.OWNER || callerRole === MemberRole.ADMIN;

  // Fetch members and pending invitations in parallel
  const [members, invitations] = await Promise.all([
    db.member.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        role: true,
        joinedAt: true,
        user: { select: { id: true, name: true, email: true, image: true } },
      },
      orderBy: { joinedAt: "asc" },
    }),
    canManage
      ? db.invitation.findMany({
          where: {
            organizationId: orgId,
            acceptedAt: null,
            expiresAt: { gt: new Date() },
          },
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            expiresAt: true,
            invitedBy: { select: { name: true } },
          },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Members</h1>
          <p className="text-sm text-muted-foreground">{organization.name}</p>
        </div>
        {canManage && (
          <InviteMemberDialog orgId={orgId} callerRole={callerRole} />
        )}
      </div>

      <Separator />

      {/* Member list */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {members.length} {members.length === 1 ? "member" : "members"}
        </h2>
        <MemberList
          orgId={orgId}
          members={members.map((m) => ({
            ...m,
            joinedAt: m.joinedAt.toISOString(),
          }))}
          currentUserId={session.user.id}
          callerRole={callerRole}
        />
      </section>

      {/* Pending invitations (managers only) */}
      {canManage && (
        <PendingInvitations
          orgId={orgId}
          invitations={invitations.map((inv) => ({
            ...inv,
            createdAt: inv.createdAt.toISOString(),
            expiresAt: inv.expiresAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
