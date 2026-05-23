import { Separator } from "@shipyard/ui/components/separator";
import { Skeleton } from "@shipyard/ui/components/skeleton";

function UsageMeterSkeleton() {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-12" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
    </div>
  );
}

export default function BillingLoading() {
  return (
    <div className="space-y-6">
      {/* Current plan section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-56" />
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          {/* Plan name + icon */}
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="size-8 rounded-md shrink-0" />
          </div>

          <Separator />

          {/* Billing date grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          <Separator />

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Usage section */}
      <section className="space-y-4">
        <div className="space-y-1">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-4 w-52" />
        </div>

        <div className="rounded-lg border bg-card p-5 space-y-4">
          <UsageMeterSkeleton />
          <Separator />
          <UsageMeterSkeleton />
        </div>
      </section>
    </div>
  );
}
