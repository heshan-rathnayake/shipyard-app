import { Card, CardContent, CardHeader } from "@shipyard/ui/components/card";
import { Separator } from "@shipyard/ui/components/separator";
import { Skeleton } from "@shipyard/ui/components/skeleton";

export default function ProjectsLoading() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <Separator />

      {/* Project grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
              {/* Project name */}
              <Skeleton className="h-5 w-36" />

              {/* Badge + menu button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="size-7 rounded-md" />
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {/* Description lines */}
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
              {/* Task count */}
              <Skeleton className="h-3 w-16 mt-1" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
