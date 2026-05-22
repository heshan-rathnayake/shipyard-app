import { Separator } from "@shipyard/ui/components/separator";
import { Skeleton } from "@shipyard/ui/components/skeleton";

function ActivityRowSkeleton() {
  return (
    <tr className="border-b last:border-0">
      {/* Who — avatar + name/email */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7 rounded-md shrink-0" />
          <div className="space-y-1.5 min-w-0">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </td>
      {/* Action badge */}
      <td className="px-4 py-3">
        <Skeleton className="h-5 w-24 rounded-full" />
      </td>
      {/* Details */}
      <td className="px-4 py-3">
        <Skeleton className="h-3.5 w-40" />
      </td>
      {/* When */}
      <td className="px-4 py-3 text-right">
        <Skeleton className="h-3.5 w-16 ml-auto" />
      </td>
    </tr>
  );
}

export default function ActivityLoading() {
  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>

      <Separator />

      <div className="space-y-4">
        {/* Toolbar: search + entity filter */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-56 rounded-md" />
          <Skeleton className="h-9 w-40 rounded-md" />
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3.5 w-8" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3.5 w-12" />
                </th>
                <th className="px-4 py-3 text-left">
                  <Skeleton className="h-3.5 w-12" />
                </th>
                <th className="px-4 py-3 text-right">
                  <Skeleton className="h-3.5 w-10 ml-auto" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, i) => (
                <ActivityRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
