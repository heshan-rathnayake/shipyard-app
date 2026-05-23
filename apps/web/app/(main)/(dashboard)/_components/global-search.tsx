"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@shipyard/ui/components/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@shipyard/ui/components/dialog";
import {
  Activity,
  Building2,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  Loader2,
  Search,
  Settings,
  Users,
  Webhook,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import type * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { userInitials } from "@/lib/userInitials";
import { trpc } from "@/src/providers/trpc-react-provider";
import { useOrgStore } from "@/src/stores/org-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  title: string;
  keywords: string[];
  url: string;
  icon: React.ComponentType<{ className?: string }>;
}

type SearchResult =
  | ({ kind: "nav" } & NavItem)
  | { kind: "org"; id: string; name: string; slug: string }
  | { kind: "project"; id: string; name: string; status: string }
  | {
      kind: "member";
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };

// ─── Static nav items ─────────────────────────────────────────────────────────

function getNavItems(orgSlug: string | null): NavItem[] {
  return [
    {
      title: "Dashboard",
      keywords: ["home", "overview"],
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    ...(orgSlug
      ? [
          {
            title: "Projects",
            keywords: ["board", "tasks", "kanban"],
            url: `/${orgSlug}/projects`,
            icon: FolderKanban,
          },
          {
            title: "Members",
            keywords: ["team", "people", "users"],
            url: `/${orgSlug}/members`,
            icon: Users,
          },
          {
            title: "Activity",
            keywords: ["log", "audit", "history"],
            url: `/${orgSlug}/activity`,
            icon: Activity,
          },
          {
            title: "Billing",
            keywords: ["subscription", "plan", "payment", "invoice", "upgrade"],
            url: `/${orgSlug}/org-settings/billing`,
            icon: CreditCard,
          },
          {
            title: "Webhooks",
            keywords: ["webhook", "integration", "stripe", "events"],
            url: `/${orgSlug}/org-settings/webhooks`,
            icon: Webhook,
          },
        ]
      : []),
    {
      title: "Settings",
      keywords: ["account", "profile", "preferences"],
      url: "/settings",
      icon: Settings,
    },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GlobalSearch() {
  const router = useRouter();
  const params = useParams();
  const storeOrgSlug = useOrgStore((s) => s.activeOrgSlug);
  const setActiveOrgSlug = useOrgStore((s) => s.setActiveOrgSlug);

  const urlOrgSlug = typeof params.orgSlug === "string" ? params.orgSlug : null;
  const orgSlug = urlOrgSlug ?? storeOrgSlug;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce query for server search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  // ── Server search ───────────────────────────────────────────────────────────
  const { data, isFetching } = trpc.search.global.useQuery(
    { orgSlug: orgSlug ?? undefined, query: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 }
  );

  // ── Client-side nav matching (instant, no debounce needed) ──────────────────
  const navResults = useMemo<NavItem[]>(() => {
    if (query.trim().length < 2) return [];
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return getNavItems(orgSlug).filter((item) => {
      const searchable = [item.title, ...item.keywords].join(" ").toLowerCase();
      return words.every((w) => searchable.includes(w));
    });
  }, [query, orgSlug]);

  // ── Flat list for keyboard navigation (pages → orgs → projects → members) ───
  const flatItems = useMemo<SearchResult[]>(() => {
    return [
      ...navResults.map((n) => ({ kind: "nav" as const, ...n })),
      ...(data?.orgs ?? []).map((o) => ({ kind: "org" as const, ...o })),
      ...(data?.projects ?? []).map((p) => ({
        kind: "project" as const,
        ...p,
      })),
      ...(data?.members ?? []).map((m) => ({ kind: "member" as const, ...m })),
    ];
  }, [navResults, data]);

  function handleSelect(item: SearchResult) {
    if (item.kind === "nav") {
      router.push(item.url);
    } else if (item.kind === "org") {
      setActiveOrgSlug(item.slug);
      router.push(`/${item.slug}/projects`);
    } else if (item.kind === "project") {
      if (!orgSlug) return;
      router.push(`/${orgSlug}/projects/${item.id}`);
    } else {
      if (!orgSlug) return;
      router.push(`/${orgSlug}/members`);
    }
    handleOpenChange(false);
  }

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) {
      setQuery("");
      setDebouncedQuery("");
      setSelectedIndex(0);
    }
  }

  const hasResults = flatItems.length > 0;
  const showEmpty =
    debouncedQuery.length >= 2 &&
    !isFetching &&
    !hasResults &&
    navResults.length === 0;

  // Index offsets for each group in flatItems
  const orgOffset = navResults.length;
  const projectOffset = orgOffset + (data?.orgs.length ?? 0);
  const memberOffset = projectOffset + (data?.projects.length ?? 0);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ml-auto flex items-center gap-2 rounded-md border border-border bg-background px-3 h-8 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="p-0 gap-0 sm:max-w-lg overflow-hidden"
          showCloseButton={false}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            inputRef.current?.focus();
          }}
        >
          <DialogTitle className="sr-only">Search</DialogTitle>

          {/* Search input row */}
          <div className="flex items-center gap-3 border-b px-4 py-3">
            {isFetching ? (
              <Loader2 className="size-4 shrink-0 text-muted-foreground animate-spin" />
            ) : (
              <Search className="size-4 shrink-0 text-muted-foreground" />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setSelectedIndex((i) =>
                    Math.min(i + 1, flatItems.length - 1)
                  );
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setSelectedIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter" && flatItems[selectedIndex]) {
                  handleSelect(flatItems[selectedIndex]);
                } else if (e.key === "Escape") {
                  handleOpenChange(false);
                }
              }}
              placeholder="Search pages, projects, and members…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query.trim().length < 2 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Wanna search for something? Just start typing...
              </p>
            ) : showEmpty ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{debouncedQuery}&rdquo;
              </p>
            ) : (
              <>
                {/* Pages group — client-side, instant */}
                {navResults.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Pages
                    </p>
                    {navResults.map((nav, i) => (
                      <button
                        key={nav.url}
                        type="button"
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                          selectedIndex === i
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/60"
                        }`}
                        onMouseEnter={() => setSelectedIndex(i)}
                        onClick={() => handleSelect({ kind: "nav", ...nav })}
                      >
                        <nav.icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 truncate font-medium">
                          {nav.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Organizations group */}
                {(data?.orgs.length ?? 0) > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Organizations
                    </p>
                    {data?.orgs.map((org, i) => {
                      const idx = orgOffset + i;
                      return (
                        <button
                          key={org.id}
                          type="button"
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedIndex === idx
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/60"
                          }`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => handleSelect({ kind: "org", ...org })}
                        >
                          <Building2 className="size-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1 truncate font-medium">
                            {org.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {org.slug}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Projects group */}
                {(data?.projects.length ?? 0) > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Projects
                    </p>
                    {data?.projects.map((project, i) => {
                      const idx = projectOffset + i;
                      return (
                        <button
                          key={project.id}
                          type="button"
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedIndex === idx
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/60"
                          }`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() =>
                            handleSelect({ kind: "project", ...project })
                          }
                        >
                          <FolderKanban className="size-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1 truncate font-medium">
                            {project.name}
                          </span>
                          <span className="text-xs capitalize text-muted-foreground">
                            {project.status.toLowerCase()}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Members group */}
                {(data?.members.length ?? 0) > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Members
                    </p>
                    {data?.members.map((member, i) => {
                      const idx = memberOffset + i;
                      return (
                        <button
                          key={member.id}
                          type="button"
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedIndex === idx
                              ? "bg-accent text-accent-foreground"
                              : "hover:bg-accent/60"
                          }`}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() =>
                            handleSelect({ kind: "member", ...member })
                          }
                        >
                          <Avatar className="size-5 shrink-0">
                            <AvatarImage
                              src={member.image ?? ""}
                              alt={member.name ?? ""}
                            />
                            <AvatarFallback className="text-[10px]">
                              {userInitials(member.name, member.email)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 truncate font-medium">
                            {member.name ?? member.email}
                          </span>
                          {member.name && (
                            <span className="max-w-36 truncate text-xs text-muted-foreground">
                              {member.email}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer hints */}
          {hasResults && (
            <div className="flex items-center gap-3 border-t px-4 py-2 text-[11px] text-muted-foreground">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>Esc close</span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
