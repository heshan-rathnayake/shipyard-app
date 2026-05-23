import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  FolderKanban,
  Search,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/src/components/theme-toggle";

export const metadata: Metadata = {
  title: "Shipyard — Project management for dev teams",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Free",
    price: "$0",
    sub: "forever",
    perks: [
      "1 active project",
      "Up to 5 members",
      "1 organization",
      "Kanban board",
      "Task comments",
      "Activity log",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$10",
    // Fixed monthly price — not per seat. Actual amount is configured in Stripe.
    sub: "flat monthly fee, not per seat",
    perks: [
      "Unlimited projects",
      "Up to 25 members",
      "Up to 10 organizations",
      "Everything in Free",
      "Priority support",
      "Advanced analytics",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "contact us for pricing",
    perks: [
      "Unlimited everything",
      "Unlimited members",
      "Unlimited organizations",
      "Everything in Pro",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
    ],
    cta: "Contact sales",
    highlight: false,
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="Shipyard" width={24} height={24} />
            <span className="text-[15px] font-semibold tracking-tight">
              Shipyard
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground"
            >
              Pricing
            </a>
            <a
              href="https://github.com/just4heshan/shipyard-app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center overflow-hidden px-6 pb-32 pt-40 text-center">
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,150,137,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,137,0.035) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% -5%, oklch(50.8% 0.118 165.612 / 0.14) 0%, transparent 65%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl">
          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Open source · Built with Next.js, tRPC & Prisma
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-extrabold leading-[1.08] tracking-tighter sm:text-6xl lg:text-[4.75rem]">
            Ship faster,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(50.8% 0.118 165.612) 0%, oklch(68% 0.16 175) 100%)",
              }}
            >
              together.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground sm:text-lg">
            Lightweight project management for small dev teams. Kanban boards,
            real-time presence, and team tools &mdash; no enterprise bloat.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start for free
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://github.com/just4heshan/shipyard-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-md border border-input px-7 text-sm font-medium transition-colors hover:bg-muted"
            >
              <svg
                aria-hidden="true"
                className="size-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View on GitHub
            </a>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Free for 1 project · No credit card required
          </p>
        </div>

        {/* Mock UI preview */}
        <div className="relative mx-auto mt-20 w-full max-w-6xl">
          <div className="overflow-hidden rounded-xl border border-border bg-muted/30 shadow-2xl shadow-black/5 backdrop-blur-sm">
            {/* Browser chrome */}
            <div className="flex h-9 items-center gap-1.5 border-b border-border bg-muted/50 px-4">
              <span className="size-2.5 rounded-full bg-muted-foreground/20" />
              <span className="size-2.5 rounded-full bg-muted-foreground/20" />
              <span className="size-2.5 rounded-full bg-muted-foreground/20" />
              <span className="mx-auto rounded border border-border bg-background px-10 py-0.5 text-[10px] text-muted-foreground/60">
                app.shipyard.dev
              </span>
            </div>
            {/* Kanban preview — CSS toggle, no client component needed */}
            <div className="relative overflow-hidden">
              {/* Light mode */}
              <Image
                src="/kanban-preview-light.png"
                alt="Kanban preview"
                width={1200}
                height={600}
                className="block rounded-lg dark:hidden"
              />
              {/* Dark mode */}
              <Image
                src="/kanban-preview-dark.png"
                alt="Kanban preview"
                width={1200}
                height={600}
                className="hidden rounded-lg dark:block"
              />
              {/* Fade out right edge */}
              <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-background/60 to-transparent" />
            </div>
          </div>
          {/* Bottom glow under the card */}
          <div
            className="pointer-events-none absolute -bottom-8 inset-x-0 h-16 blur-2xl"
            style={{
              background:
                "radial-gradient(ellipse 60% 100% at 50% 100%, oklch(50.8% 0.118 165.612 / 0.12) 0%, transparent 70%)",
            }}
          />
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="px-6 pb-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Everything your team needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              No fluff. Just the tools that help you ship.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Kanban — wide card */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:bg-muted/50 md:col-span-2">
              <div className="mb-4 text-primary">
                <FolderKanban className="size-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Kanban boards</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Visualize your workflow with drag-and-drop task management.
                Create tasks, move tasks, and track every project from kickoff
                to ship.
              </p>
              {/* Mini kanban illustration — mirrors real TaskCard structure */}
              <div className="mt-6 flex gap-2 opacity-50 transition-opacity group-hover:opacity-70">
                {(
                  [
                    {
                      name: "To Do",
                      tasks: [
                        {
                          title: "Design system tokens",
                          priority: "MEDIUM",
                          due: "Jun 15",
                          initials: "AK",
                        },
                        {
                          title: "Write API docs",
                          priority: "LOW",
                          due: null,
                          initials: null,
                        },
                      ],
                    },
                    {
                      name: "In Progress",
                      tasks: [
                        {
                          title: "Auth flow refactor",
                          priority: "HIGH",
                          due: "Jun 10",
                          initials: "JH",
                        },
                        {
                          title: "Dashboard metrics",
                          priority: "MEDIUM",
                          due: null,
                          initials: "SL",
                        },
                      ],
                    },
                    {
                      name: "Done",
                      tasks: [
                        {
                          title: "Set up CI/CD pipeline",
                          priority: "LOW",
                          due: null,
                          initials: "AK",
                        },
                      ],
                    },
                    {
                      name: "Canceled",
                      tasks: [
                        {
                          title: "Legacy API migration",
                          priority: "URGENT",
                          due: null,
                          initials: null,
                        },
                      ],
                    },
                  ] as const
                ).map((col) => (
                  <div
                    key={col.name}
                    className="flex-1 rounded-md border border-border bg-background/70 p-2"
                  >
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                      {col.name}
                    </p>
                    <div className="space-y-1.5">
                      {col.tasks.map((task) => (
                        <div
                          key={task.title}
                          className="space-y-1.5 rounded-md border bg-card p-2 select-none"
                        >
                          {/* Title — mirrors: text-sm font-medium leading-snug line-clamp-2 */}
                          <p className="line-clamp-2 text-[11px] font-medium leading-snug">
                            {task.title}
                          </p>
                          {/* Footer row — mirrors: flex items-center justify-between gap-2 */}
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1">
                              {/* Priority badge — mirrors Badge with PRIORITY_VARIANT */}
                              <span
                                className={`inline-flex items-center rounded-sm px-1 text-[9px] font-medium leading-4 ${
                                  task.priority === "LOW"
                                    ? "border border-border text-muted-foreground"
                                    : task.priority === "MEDIUM"
                                      ? "bg-secondary text-secondary-foreground"
                                      : task.priority === "HIGH"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-destructive text-destructive-foreground"
                                }`}
                              >
                                {task.priority.charAt(0) +
                                  task.priority.slice(1).toLowerCase()}
                              </span>
                              {/* Due date — mirrors: CalendarDays + toLocaleDateString */}
                              {task.due && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] text-muted-foreground">
                                  <CalendarDays className="size-2.5" />
                                  {task.due}
                                </span>
                              )}
                            </div>
                            {/* Assignee avatar — mirrors: Avatar size-5 + AvatarFallback text-[10px] */}
                            {task.initials && (
                              <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-muted text-[8px] font-medium text-muted-foreground">
                                {task.initials}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Presence */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:bg-muted/50">
              <div className="mb-4 text-primary">
                <Users className="size-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Real-time presence</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                See who's online and what they're working on. Live avatar stacks
                keep the whole team in sync.
              </p>
              {/* Presence illustration */}
              <div className="mt-6 space-y-4">
                {/* Avatar stack with online indicators */}
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((n, i) => (
                    <div key={n} className="relative">
                      <Image
                        src={`/user-avatars/user${n}.jpg`}
                        alt="Team member"
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-background object-cover"
                      />
                      {/* Online dot — first 5 are active */}
                      {i < 5 && (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-primary" />
                      )}
                    </div>
                  ))}
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
                    +5
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    10 members
                  </span>{" "}
                  active right now
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:bg-muted/50">
              <div className="mb-4 text-primary">
                <Search className="size-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Global search</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Find projects, members, and pages instantly. Hit{" "}
                <kbd className="rounded border bg-background px-1.5 font-mono text-[10px]">
                  ⌘K
                </kbd>{" "}
                from anywhere.
              </p>
            </div>

            {/* Activity */}
            <div className="rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:bg-muted/50">
              <div className="mb-4 text-primary">
                <Activity className="size-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Activity feed</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Full audit trail of every action taken across your org. Know who
                did what and when.
              </p>
            </div>

            {/* Role-based access */}
            <div className="rounded-xl border border-border bg-muted/30 p-7 transition-colors hover:bg-muted/50">
              <div className="mb-4 text-primary">
                <ShieldCheck className="size-10" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Role-based access</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Assign owners, admins, members, and viewers. Control who can see
                and change what across your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 pb-28">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Simple, honest pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Start free, scale when you need to.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-0 sm:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col bg-zinc-500/5  border p-7 rounded-xl ${
                  plan.highlight
                    ? "border-primary/50! bg-primary/5! md:-my-6 rounded-xl"
                    : plan.name === "Free"
                      ? "rounded-tl-xl rounded-bl-xl md:rounded-tr-none md:rounded-br-none"
                      : plan.name === "Enterprise"
                        ? "rounded-tr-xl rounded-br-xl md:rounded-tl-none md:rounded-bl-none"
                        : "border-border bg-muted/30"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[11px] font-semibold text-primary-foreground">
                    Most popular
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {plan.name}
                  </p>
                  <p className="mt-2 text-4xl font-extrabold tracking-tight">
                    {plan.price}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {plan.sub}
                  </p>
                </div>

                <ul className="my-7 flex-1 space-y-2.5 text-sm">
                  {plan.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2.5">
                      <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                      {perk}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="mb-12">
        <div className="relative mx-auto overflow-hidden px-8 py-20 text-center">
          {/* BG layers */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, oklch(50.8% 0.118 165.612 / 0.0) 0%, oklch(50.8% 0.118 165.612 / 0.04) 100%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,150,137,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,150,137,0.06) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          <div className="relative">
            <div className="mx-auto mb-5 flex items-center justify-center">
              <Zap className="size-10 text-primary" />
            </div>
            <h2 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Smarter project management is just a click away
            </h2>
            <p className="mb-8 text-muted-foreground">
              Set up your workspace in under a minute. No credit card required.
            </p>
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create your workspace
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Image src="/logo.png" alt="Shipyard" width={18} height={18} />
            <span className="font-semibold">Shipyard</span>
            <span className="text-muted-foreground">© 2026</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/just4heshan/shipyard-app"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
