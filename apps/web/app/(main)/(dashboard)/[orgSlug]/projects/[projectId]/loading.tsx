import { Skeleton } from "@shipyard/ui/components/skeleton";

// Vary card counts per column so the skeleton looks natural
const COLUMN_CARDS = [3, 2, 2, 1];

function TaskCardSkeleton() {
  return (
    <div className="rounded-md border bg-card p-3 space-y-2">
      {/* Title — two lines */}
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-3/4" />

      {/* Footer row: priority badge + assignee avatar */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="size-5 rounded-full shrink-0" />
      </div>
    </div>
  );
}

function ColumnSkeleton({ cardCount }: { cardCount: number }) {
  return (
    <div className="flex flex-col gap-2 w-64 shrink-0 h-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-6 rounded-full" />
        </div>
        <Skeleton className="size-7 rounded-md shrink-0" />
      </div>

      {/* Droppable area */}
      <div className="flex flex-col gap-2 rounded-lg p-2 flex-1 min-h-32 bg-muted/40">
        {Array.from({ length: cardCount }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function ProjectBoardLoading() {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* ProjectHeader */}
      <div className="space-y-1.5 shrink-0">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-4 flex-1 min-h-0">
        {COLUMN_CARDS.map((count, i) => (
          <ColumnSkeleton key={i} cardCount={count} />
        ))}
      </div>
    </div>
  );
}
