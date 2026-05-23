import { db } from "@shipyard/db";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { DashboardContent } from "./_components/dashboard-content";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const membershipsRaw = await db.member.findMany({
    where: { userId: session.user.id },
    select: {
      role: true,
      organization: {
        select: { id: true, name: true, slug: true },
      },
    },
    orderBy: { organization: { name: "asc" } },
  });

  // No orgs yet — send to guided setup
  if (membershipsRaw.length === 0) redirect("/onboarding");

  // Float owned orgs to the top
  const memberships = [...membershipsRaw].sort((a, b) => {
    if (a.role === "OWNER" && b.role !== "OWNER") return -1;
    if (b.role === "OWNER" && a.role !== "OWNER") return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      <DashboardContent
        memberships={memberships.map((m) => ({
          role: m.role,
          orgId: m.organization.id,
          orgName: m.organization.name,
          orgSlug: m.organization.slug,
        }))}
      />
    </div>
  );
}
