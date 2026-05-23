import { Skeleton } from "@shipyard/ui/components/skeleton";

export default function GeneralSettingsLoading() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>

        <div className="rounded-lg border bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
