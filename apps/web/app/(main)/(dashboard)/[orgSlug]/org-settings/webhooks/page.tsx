import { Info } from "lucide-react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireOrgMembership } from "@/server/requireOrgMembership";
import { BreadcrumbSetter } from "@/src/components/breadcrumb-setter";
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
      <BreadcrumbSetter labels={{ [orgSlug]: membership.organization.name }} />
      <div>
        <h2 className="text-base font-semibold">Webhook events</h2>
        <p className="text-sm text-muted-foreground">
          Stripe webhook events received by this server, including retry and
          dead-letter status. Only visible to organization owners.
        </p>
      </div>

      {/* Portfolio note — in production this would live in a platform-admin panel, not org settings */}
      <div className="flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3 text-sm text-blue-600 dark:text-blue-400">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          <span className="font-medium">Portfolio note:</span> In a production
          platform, Stripe webhook logs would be restricted to internal
          operators via a separate admin panel — not exposed within org
          settings. This page is included here to demonstrate webhook processing
          and event lifecycle tracking.
        </p>
      </div>

      <WebhookEventsTable orgId={membership.organization.id} />
    </div>
  );
}
