import { db } from "@shipyard/db";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/server/auth";
import { AcceptInviteCard } from "./_components/accept-invite-card";
import { SwitchAccountButton } from "./_components/switch-account-button";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const session = await auth();
  if (!session) redirect(`/login?callbackUrl=/invite/${token}`);

  const invitation = await db.invitation.findUnique({
    where: { token },
    select: {
      email: true,
      role: true,
      acceptedAt: true,
      expiresAt: true,
      organization: { select: { name: true } },
    },
  });

  let content: ReactNode;

  // Invalid or already accepted
  if (!invitation || invitation.acceptedAt) {
    content = (
      <div className="w-full max-w-sm space-y-2 text-center">
        <h1 className="text-xl font-bold">Invalid invitation</h1>
        <p className="text-sm text-muted-foreground">
          This invitation link is invalid or has already been used.
        </p>
      </div>
    );
  } else if (invitation.expiresAt < new Date()) {
    // Expired
    content = (
      <div className="w-full max-w-sm space-y-2 text-center">
        <h1 className="text-xl font-bold">Invitation expired</h1>
        <p className="text-sm text-muted-foreground">
          This invitation has expired. Ask the organization owner to send a new
          one.
        </p>
      </div>
    );
  } else if (invitation.email !== session.user.email) {
    // Wrong account
    content = (
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-xl font-bold">Wrong account</h1>
          <p className="text-sm text-muted-foreground">
            This invitation was sent to <strong>{invitation.email}</strong>.
            Sign in with that account to accept.
          </p>
        </div>
        <SwitchAccountButton token={token} />
      </div>
    );
  } else {
    content = (
      <AcceptInviteCard
        token={token}
        orgName={invitation.organization.name}
        role={invitation.role}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Brand mark */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex w-fit items-center gap-2.5"
      >
        <Image
          src="/logo.png"
          alt="Shipyard logo"
          width={28}
          height={28}
          className="shrink-0"
        />
        <span className="text-[15px] font-semibold tracking-tight">
          Shipyard
        </span>
      </Link>
      {content}
    </div>
  );
}
