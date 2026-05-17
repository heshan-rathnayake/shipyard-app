# @shipyard/web

The Next.js web application for Shipyard. Handles authentication, the organisation dashboard, Kanban project boards, billing, activity feeds, and all user-facing UI.

## Tech stack

- **Next.js 15** (App Router) with React 19
- **tRPC 11** + **React Query 5** for type-safe API calls
- **NextAuth.js v5** — Google OAuth, GitHub OAuth, email/password
- **Prisma 7** via `@shipyard/db` for database access
- **Zustand 5** for client-side state (Kanban board, org store)
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI** for styling and components
- **@dnd-kit** for drag-and-drop on the Kanban board
- **Socket.io client** for real-time collaboration
- **Stripe** for subscription billing
- **Vitest** for unit testing

## Development

From the monorepo root:

```sh
yarn dev
```

To run only this app:

```sh
yarn workspace @shipyard/web dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `apps/web/.env.local` with the following:

```env
# App
NEXTAUTH_URL=http://localhost:3000
AUTH_SECRET=                        # openssl rand -hex 32

# Database
DATABASE_URL=postgresql://...

# OAuth providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=

# Socket server
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
SOCKET_SECRET=
```

## Project structure

```
apps/web/
├── app/
│   ├── (auth)/              # Sign-in, sign-up, forgot password pages
│   ├── (main)/
│   │   ├── (dashboard)/     # Protected dashboard layout
│   │   │   ├── dashboard/   # Organisation overview
│   │   │   ├── [orgSlug]/
│   │   │   │   ├── projects/          # Project list (active + archived)
│   │   │   │   │   └── [projectId]/   # Kanban board
│   │   │   │   ├── activity/          # Organisation activity log
│   │   │   │   ├── members/           # Member management
│   │   │   │   └── org-settings/          # Org settings and billing
│   │   │   └── _components/           # Sidebar, nav, org-switcher
│   │   └── api/             # Next.js route handlers (tRPC, auth, webhooks)
│   └── globals.css
├── lib/                     # Pure utility functions (toSlugPreview, userInitials, etc.)
├── server/                  # Server-only helpers (session, org membership guards)
├── src/
│   ├── components/          # Shared client components (ConfirmDialog, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── providers/           # tRPC, Socket, theme providers
│   └── stores/              # Zustand stores (kanban, org)
└── public/
```

## Key commands

```sh
# Type check
yarn workspace @shipyard/web check-types

# Lint
yarn workspace @shipyard/web lint

# Unit tests
yarn workspace @shipyard/web test
yarn workspace @shipyard/web test:watch
```

## Building for production

```sh
yarn workspace @shipyard/web build
```

The build requires all workspace packages (`@shipyard/api`, `@shipyard/db`, `@shipyard/ui`, etc.) to be built first. Running `yarn build` from the monorepo root handles this automatically via Turborepo.
