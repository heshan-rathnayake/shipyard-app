# @shipyard/types

Shared TypeScript types for Shipyard. Used by `apps/web`, `apps/socket`, and `packages/api` to keep event and data shapes in sync across the stack.

## Task types

```ts
import type { Task, TaskStatus, TaskPriority } from "@shipyard/types/task";

type TaskStatus  = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  position: number;
  dueDate: string | null;    // ISO 8601 string
  createdAt: string;         // ISO 8601 string
  assignee: {
    id: string;
    user: { name: string | null; image: string | null };
  } | null;
}
```

## Socket types

```ts
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
  PresenceUser,
} from "@shipyard/types/socket";
```

### Client → Server events

| Event | Payload |
|-------|---------|
| `presence:join` | `{ projectId: string }` |
| `presence:leave` | `{ projectId: string }` |
| `task:created` | `{ projectId: string; task: Task }` |
| `task:updated` | `{ projectId: string; task: Task }` |
| `task:deleted` | `{ projectId: string; taskId: string }` |
| `task:moved` | `{ projectId: string; taskId: string; status: TaskStatus; position: number }` |
| `task:reordered` | `{ projectId: string; tasks: { id: string; position: number }[] }` |

### Server → Client events

| Event | Payload |
|-------|---------|
| `presence:update` | `{ projectId: string; users: PresenceUser[] }` |
| `task:created` | `{ projectId: string; task: Task }` |
| `task:updated` | `{ projectId: string; task: Task }` |
| `task:deleted` | `{ projectId: string; taskId: string }` |
| `task:moved` | `{ projectId: string; taskId: string; status: TaskStatus; position: number }` |
| `task:reordered` | `{ projectId: string; tasks: { id: string; position: number }[] }` |
