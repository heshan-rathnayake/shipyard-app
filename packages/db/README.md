# @shipyard/db

Prisma client and schema for Shipyard. Exports a singleton `db` instance and all database enums.

## Setup

```sh
# Copy the env file and set your connection string
cp .env.example .env

# Apply migrations (development)
yarn workspace @shipyard/db db:migrate

# Regenerate the client after schema changes
yarn workspace @shipyard/db db:generate
```

## Environment variable

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/shipyard` |

## Scripts

| Script | Command |
|--------|---------|
| `db:generate` | `prisma generate` |
| `db:migrate` | `prisma migrate dev` |
| `db:push` | `prisma db push` (schema push without migration) |
| `db:studio` | `prisma studio` (opens the Prisma data browser) |

## Schema files

The schema is split across multiple files in `prisma/`:

| File | Models |
|------|--------|
| `enums.prisma` | `SubscriptionTier`, `MemberRole`, `ProjectStatus`, `TaskStatus`, `Priority`, `SubscriptionStatus`, `EmailStatus` |
| `auth.prisma` | `User`, `Account`, `Session`, `Password`, `VerificationToken` |
| `organization.prisma` | `Organization`, `Member`, `Team`, `TeamMember`, `Invitation` |
| `project.prisma` | `Project`, `ProjectTeam`, `Task`, `Comment` |
| `payment.prisma` | `Subscription`, `WebhookEvent` |
| `realtime.prisma` | `Presence` |
| `infrastructure.prisma` | `ActivityLog`, `EmailLog` |

## Enums

```ts
import {
  SubscriptionTier,   // FREE | PRO | ENTERPRISE
  MemberRole,         // OWNER | ADMIN | MEMBER | VIEWER
  ProjectStatus,      // ACTIVE | ARCHIVED | COMPLETED
  TaskStatus,         // TODO | IN_PROGRESS | DONE | CANCELLED
  Priority,           // LOW | MEDIUM | HIGH | URGENT
  SubscriptionStatus, // ACTIVE | PAST_DUE | CANCELED | UNPAID | TRIALING | INCOMPLETE
  EmailStatus,        // PENDING | SENT | FAILED | BOUNCED
} from "@shipyard/db/enum";
```

## Usage

```ts
import { db } from "@shipyard/db";

const project = await db.project.findUnique({ where: { id } });
```

The exported `db` is a singleton `PrismaClient` using the `@prisma/adapter-pg` connection pool adapter.
