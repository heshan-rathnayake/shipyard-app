# Shipyard

A full-stack project management SaaS built as a Turborepo monorepo. Teams can create organisations, manage projects on a Kanban board, collaborate in real time, and subscribe to paid plans via Stripe.

## Apps and packages

### Apps

| App           | Package name       | Description                                                         |
| ------------- | ------------------ | ------------------------------------------------------------------- |
| `apps/web`    | `@shipyard/web`    | Next.js 15 web application — auth, dashboard, Kanban board, billing |
| `apps/socket` | `@shipyard/socket` | Express + Socket.io server — real-time task and presence events     |

### Packages

| Package                      | Name                          | Description                                                  |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------ |
| `packages/api`               | `@shipyard/api`               | tRPC routers, procedures, and all server-side business logic |
| `packages/db`                | `@shipyard/db`                | Prisma client, multi-file schema, and database migrations    |
| `packages/email`             | `@shipyard/email`             | React Email templates and Resend sending helper              |
| `packages/logger`            | `@shipyard/logger`            | Shared tslog logger instance                                 |
| `packages/types`             | `@shipyard/types`             | Shared TypeScript types and interfaces                       |
| `packages/ui`                | `@shipyard/ui`                | Component library — Radix UI + shadcn/ui, Tailwind CSS       |
| `packages/testing`           | `@shipyard/testing`           | Vitest config and shared test factories                      |
| `packages/typescript-config` | `@shipyard/typescript-config` | Shared `tsconfig.json` bases                                 |

## Tech stack

- **Framework** — Next.js 15, React 19
- **API** — tRPC 11 with React Query
- **Database** — PostgreSQL 18 via Prisma 7
- **Auth** — NextAuth.js v5 (Google, GitHub OAuth + email/password)
- **Real-time** — Socket.io
- **Styling** — Tailwind CSS 4, shadcn/ui, Radix UI
- **Payments** — Stripe
- **Email** — React Email + Resend
- **State** — Zustand
- **Linting/Formatting** — Biome
- **Package manager** — Yarn 4 (Berry)

## Prerequisites

- Node.js ≥ 22
- Yarn 4 (`corepack enable`)
- Docker (for PostgreSQL and MailHog in development)

## Getting started

### 1. Install dependencies

```sh
yarn install
```

### 2. Set up environment variables

Copy the example files and fill in values:

```sh
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
cp packages/db/.env.example packages/db/.env
cp apps/socket/.env.example apps/socket/.env
```

### 3. Start infrastructure

```sh
docker compose up -d
```

This starts:

- **PostgreSQL 18** on port `5432`
- **MailHog** SMTP on port `1025`, web UI on port `8025`


### 4. Run database migrations

```sh
yarn workspace @shipyard/db prisma migrate dev
```

### 5. Start the development servers

```sh
yarn dev
```

This runs `web` (port 3000) and `socket` in parallel via Turborepo.

## Common commands

```sh
# Development
yarn dev                          # Start all apps
yarn workspace @shipyard/web dev  # Start only the web app

# Building
yarn build                        # Build all packages and apps

# Type checking
yarn check-types

# Linting / formatting
yarn lint
yarn format

# Testing
yarn test                         # Run all unit tests
yarn workspace @shipyard/api test # Run API unit tests only
yarn workspace @shipyard/web test # Run web unit tests only

# Database
yarn workspace @shipyard/db prisma migrate dev    # Apply migrations
yarn workspace @shipyard/db prisma studio         # Open Prisma Studio
yarn workspace @shipyard/db prisma generate       # Regenerate client after schema changes
```

## Project structure

```
shipyard/
├── apps/
│   ├── web/          # Next.js application
│   └── socket/       # Socket.io server
├── packages/
│   ├── api/          # tRPC routers and business logic
│   ├── db/           # Prisma schema and client
│   ├── email/        # Email templates
│   ├── logger/       # Shared logger
│   ├── types/        # Shared types
│   ├── ui/           # Component library
│   ├── testing/      # Test utilities
│   └── typescript-config/
├── docker-compose.yml
├── turbo.json
└── package.json
```
