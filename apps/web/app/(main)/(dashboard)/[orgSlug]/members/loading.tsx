import { Separator } from "@shipyard/ui/components/separator";
import { Skeleton } from "@shipyard/ui/components/skeleton";

export default function MembersLoading() {
  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-32 rounded-md" />
      </div>

      <Separator />

      {/* Member list */}
      <section className="space-y-3">
        <Skeleton className="h-4 w-20" />
        <div className="divide-y divide-border rounded-lg border">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              {/* Avatar */}
              <Skeleton className="h-8 w-8 rounded-lg shrink-0" />

              {/* Name + email */}
              <div className="flex-1 min-w-0 space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-52" />
              </div>

              {/* Role badge */}
              <Skeleton className="h-5 w-16 rounded-full" />

              {/* Actions button */}
              <Skeleton className="size-8 rounded-md shrink-0" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
