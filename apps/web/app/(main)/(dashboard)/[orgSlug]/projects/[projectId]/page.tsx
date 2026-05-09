import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@shipyard/db";
import { requireOrgMembership } from "@/server/requireOrgMembership";
import { KanbanBoard } from "./_components/kanban-board";

export const metadata: Metadata = { title: "Board" };

export default async function ProjectBoardPage({
  params,
}: {
  params: Promise<{ orgSlug: string; projectId: string }>;
}) {
  const { orgSlug, projectId } = await params;

  const { membership } = await requireOrgMembership(orgSlug);
  const { role: callerRole, organization } = membership;
  const orgId = organization.id;
  const currentMemberId = membership.id;

  const [project, tasks, members] = await Promise.all([
    db.project.findFirst({
      where: { id: projectId, organizationId: orgId },
      select: { id: true, name: true, description: true, status: true },
    }),
    db.task.findMany({
      where: { projectId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        position: true,
        dueDate: true,
        createdAt: true,
        assignee: {
          select: {
            id: true,
            user: { select: { name: true, image: true } },
          },
        },
      },
      orderBy: { position: "asc" },
    }),
    db.member.findMany({
      where: { organizationId: orgId },
      select: {
        id: true,
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { joinedAt: "asc" },
    }),
  ]);

  if (!project) notFound();

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Back link + header */}
      <div className="space-y-1 shrink-0">
        <Link
          href={`/${orgSlug}/projects`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Projects
        </Link>
        <h1 className="text-xl font-bold tracking-tight">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-muted-foreground">{project.description}</p>
        )}
      </div>

      <KanbanBoard
        projectId={projectId}
        orgId={orgId}
        callerRole={callerRole}
        currentMemberId={currentMemberId}
        initialTasks={tasks.map((t) => ({
          ...t,
          dueDate: t.dueDate ? t.dueDate.toISOString() : null,
          createdAt: t.createdAt.toISOString(),
        }))}
        members={members}
      />
    </div>
  );
}
