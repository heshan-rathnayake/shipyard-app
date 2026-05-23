import { Separator } from "@shipyard/ui/components/separator";
import { Skeleton } from "@shipyard/ui/components/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-8 max-w-3xl">
      {/* Heading */}
      <div className="space-y-1.5">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Separator />

      {/* Profile */}
      <section className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-lg border bg-card p-5 space-y-5">
          {/* Avatar + identity row */}
          <div className="flex items-center gap-4">
            <Skeleton className="size-14 rounded-full shrink-0" />
            <div className="space-y-1.5 min-w-0">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3.5 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
          {/* Form inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </section>

      <Separator />

      {/* Password */}
      <section className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </section>

      <Separator />

      {/* Appearance */}
      <section className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-sm">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 rounded-lg" />
          ))}
        </div>
      </section>

      <Separator />

      {/* Danger zone */}
      <section className="space-y-3">
        <div className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-3/4" />
            </div>
            <Skeleton className="h-8 w-32 shrink-0 rounded-md" />
          </div>
        </div>
      </section>
    </div>
  );
}
