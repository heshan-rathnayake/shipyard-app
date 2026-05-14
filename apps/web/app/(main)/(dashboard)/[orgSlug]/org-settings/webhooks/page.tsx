import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOrgMembership } from "@/server/requireOrgMembership";
import { WebhookEventsTable } from "./_components/webhook-events-table";

export const metadata: Metadata = { title: "Webhooks" };

export default async function WebhooksPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { membership } = await requireOrgMembership(orgSlug);

  // Only owners can view webhook events — ops-level data
  if (membership.role !== "OWNER") {
    redirect(`/${orgSlug}/org-settings/billing`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Webhook events</h2>
        <p className="text-sm text-muted-foreground">
          Stripe webhook events received by this server, including retry and
          dead-letter status. Only visible to organization owners.
        </p>
      </div>

      <WebhookEventsTable orgId={membership.organization.id} />
    </div>
  );
}
