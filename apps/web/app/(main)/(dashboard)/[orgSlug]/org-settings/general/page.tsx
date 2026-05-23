import { Separator } from "@shipyard/ui/components/separator";
import type { Metadata } from "next";
import { requireOrgMembership } from "@/server/requireOrgMembership";
import { BreadcrumbSetter } from "@/src/components/breadcrumb-setter";
import { DeleteOrgButton } from "./_components/delete-org-button";
import { OrgNameForm } from "./_components/org-name-form";

export const metadata: Metadata = { title: "General settings" };

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ orgSlug: string }>;
}) {
  const { orgSlug } = await params;
  const { membership } = await requireOrgMembership(orgSlug);
  const { organization, role } = membership;

  const isOwner = role === "OWNER";
  const canEdit = role === "OWNER" || role === "ADMIN";

  return (
    <>
      <BreadcrumbSetter labels={{ [orgSlug]: organization.name }} />

      <div className="space-y-8">
        {/* Organization identity */}
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold">Organization</h2>
            <p className="text-sm text-muted-foreground">
              {canEdit
                ? "Update your organization's display name. The URL slug cannot be changed after creation."
                : "You can view but not edit organization details — only owners and admins can make changes."}
            </p>
          </div>

          <OrgNameForm
            orgId={organization.id}
            orgName={organization.name}
            orgSlug={organization.slug}
            canEdit={canEdit}
          />
        </section>

        {/* Danger Zone — owners only */}
        {isOwner && (
          <>
            <Separator />

            <section className="space-y-3">
              <div>
                <h2 className="text-base font-semibold text-destructive">
                  Danger zone
                </h2>
                <p className="text-sm text-muted-foreground">
                  Irreversible actions that affect this entire organization.
                </p>
              </div>

              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      Delete this organization
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove{" "}
                      <strong className="text-foreground">
                        {organization.name}
                      </strong>{" "}
                      and all its projects, tasks, members, and billing data.
                      This cannot be undone.
                    </p>
                  </div>
                  <div className="shrink-0">
                    <DeleteOrgButton
                      orgId={organization.id}
                      orgName={organization.name}
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
