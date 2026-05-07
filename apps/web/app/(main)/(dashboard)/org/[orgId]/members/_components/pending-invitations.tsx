"use client";

import { useRouter } from "next/navigation";
import { Clock, X } from "lucide-react";
import { trpc } from "@/src/trpc/react";
import { Badge } from "@shipyard/ui/components/badge";
import { Button } from "@shipyard/ui/components/button";
import type { MemberRole } from "@shipyard/db/enum";

interface Invitation {
  id: string;
  email: string;
  role: MemberRole;
  createdAt: string;
  expiresAt: string;
  invitedBy: { name: string | null };
}

interface PendingInvitationsProps {
  orgId: string;
  invitations: Invitation[];
}

function daysUntil(dateStr: string) {
  const ms = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function PendingInvitations({
  orgId,
  invitations,
}: PendingInvitationsProps) {
  const router = useRouter();
  const cancel = trpc.member.cancelInvitation.useMutation({
    onSuccess: () => router.refresh(),
  });

  if (invitations.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground">
        Pending invitations ({invitations.length})
      </h2>

      <div className="divide-y divide-border rounded-lg border">
        {invitations.map((inv) => (
          <div key={inv.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Clock className="size-4" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium">{inv.email}</p>
              <p className="text-xs text-muted-foreground">
                Invited by {inv.invitedBy.name ?? "unknown"} · expires in{" "}
                {daysUntil(inv.expiresAt)}d
              </p>
            </div>

            <Badge variant="outline">{inv.role}</Badge>

            <Button
              variant="ghost"
              size="sm"
              className="size-8 p-0 text-muted-foreground hover:text-destructive"
              disabled={cancel.isPending}
              onClick={() => cancel.mutate({ orgId, invitationId: inv.id })}
              title="Cancel invitation"
            >
              <X className="size-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
