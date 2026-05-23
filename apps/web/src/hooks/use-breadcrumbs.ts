"use client";

import { usePathname } from "next/navigation";
import { useBreadcrumbContext } from "@/src/providers/breadcrumb-provider";

// Map known static path segments to their display labels.
// Dynamic segments (orgSlug, projectId, etc.) are resolved from context.
const STATIC_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projects",
  members: "Members",
  activity: "Activity",
  settings: "Settings",
  "org-settings": "Settings",
  general: "General",
  billing: "Billing",
  webhooks: "Webhooks",
};

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent: boolean;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const pathname = usePathname();
  const { labels } = useBreadcrumbContext();

  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = STATIC_LABELS[segment] ?? labels[segment] ?? segment;
    const isCurrent = index === segments.length - 1;

    return { label, href, isCurrent };
  });
}
