import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@shipyard/db";
import { CreateOrgDialog } from "./_components/create-org-dialog";

export default async function DashboardPage() {
  // Permission check lives here, never in layout.tsx
  const session = await auth();
  if (!session) redirect("/login");

  console.log("Session in dashboard page:", session);

  const memberships = await db.member.findMany({
    where: { userId: session.user.id },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          subscriptionTier: true,
          _count: { select: { members: true, projects: true } },
        },
      },
    },
    orderBy: { joinedAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Organizations</h1>
        <CreateOrgDialog />
      </div>

      {memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center">
          <p className="text-lg font-medium">No organizations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first organization to start managing projects.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {memberships.map(({ organization, role }) => (
            <Link
              key={organization.id}
              href={`/org/${organization.id}`}
              className="group rounded-lg border bg-card p-5 transition-colors hover:border-foreground/30 hover:bg-muted/50"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-semibold group-hover:underline">
                  {organization.name}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {role}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                /{organization.slug}
              </p>
              <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                <span>{organization._count.members} members</span>
                <span>{organization._count.projects} projects</span>
              </div>
              <div className="mt-2">
                <span className="text-xs text-muted-foreground">
                  {organization.subscriptionTier}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
