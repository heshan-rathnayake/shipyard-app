# @shipyard/api

All server-side business logic for Shipyard. Exposes a type-safe tRPC router consumed by `apps/web` and generates JWT tokens used by `apps/socket`.

## Routers

| Router | Prefix | Description |
|--------|--------|-------------|
| `organizationRouter` | `organization.*` | Org CRUD, slug management, member invitations |
| `memberRouter` | `member.*` | Role changes, member removal |
| `projectRouter` | `project.*` | Project CRUD, archive/unarchive |
| `taskRouter` | `task.*` | Task CRUD, status updates, drag-and-drop reorder |
| `commentRouter` | `comment.*` | Task comments with @mention encoding |
| `activityLogRouter` | `activityLog.*` | Paginated audit trail |
| `socketRouter` | `socket.*` | Issues signed JWT for Socket.io auth |
| `subscriptionRouter` | `subscription.*` | Stripe subscription management |

## Procedures

All procedures are either `publicProcedure` (no auth required) or `protectedProcedure` (valid session required). Most mutation procedures additionally enforce role guards.

## Guards

### Membership guards (`src/lib/membership.ts`)

| Function | Throws if |
|----------|-----------|
| `requireMembership(db, userId, orgId)` | User is not a member of the org |
| `requireManagerRole(role)` | Role is not `OWNER` or `ADMIN` |
| `requireContributorRole(role)` | Role is `VIEWER` |
| `requireOwner(role)` | Role is not `OWNER` |

### Project / task guards (`src/lib/projectGuards.ts`)

| Function | Returns | Throws if |
|----------|---------|-----------|
| `assertProjectBelongsToOrg(db, projectId, orgId)` | Project | Project doesn't belong to the org |
| `assertTaskBelongsToOrg(db, taskId, orgId)` | Task | Task doesn't belong to the org |

## Activity logging

`logActivity(input)` in `src/lib/activityLog.ts` writes to the `ActivityLog` table.

```ts
import { logActivity, ActivityAction, EntityType } from "./activityLog";

void logActivity({
  db,
  orgId,
  memberId,
  action: ActivityAction.TASK_CREATED,
  entityType: EntityType.TASK,
  entityId: task.id,
  metadata: { title: task.title },
});
```

## Plan limits (`src/config/plans.ts`)

Subscription tier limits are defined here. Import `PROJECT_LIMITS` or `ORG_OWNER_LIMITS` when enforcing caps in procedures.

## Exports

```ts
import { appRouter }   from "@shipyard/api/server/routers/_app";
import { createContext } from "@shipyard/api/server/context";
import { router, protectedProcedure, publicProcedure } from "@shipyard/api/server/trpc";
import { toSlug }      from "@shipyard/api/lib/slug";
import { PROJECT_LIMITS, ORG_OWNER_LIMITS } from "@shipyard/api/config/plans";
```
