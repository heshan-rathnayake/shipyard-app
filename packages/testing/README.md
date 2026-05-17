# @shipyard/testing

Shared test factories for Shipyard. Provides typed mock objects with sensible defaults so unit tests across `packages/api` and `apps/web` stay in sync with the actual data shapes.

This package is a `devDependency` only — it is never shipped to production.

## Factories

```ts
import { mockTask, mockUser, mockMember, mockOrg } from "@shipyard/testing";
```

### `mockTask(overrides?)`

```ts
const task = mockTask({ status: "DONE", priority: "URGENT" });
// {
//   id: "task-1",
//   title: "Mock Task",
//   status: "DONE",
//   priority: "URGENT",
//   position: 0,
//   description: null,
//   dueDate: null,
//   assignee: null,
//   createdAt: "2024-01-01T00:00:00.000Z",
// }
```

### `mockUser(overrides?)`

```ts
const user = mockUser({ name: "Bob Jones" });
// { id: "user-1", name: "Bob Jones", email: "alice@example.com", image: null }
```

### `mockMember(overrides?)`

```ts
const member = mockMember({ role: "ADMIN" });
// { id: "member-1", userId: "user-1", organizationId: "org-1", role: "ADMIN", joinedAt: "2024-01-01T00:00:00.000Z" }
```

### `mockOrg(overrides?)`

```ts
const org = mockOrg({ subscriptionTier: "PRO" });
// { id: "org-1", name: "Acme Inc", slug: "acme-inc", subscriptionTier: "PRO", isActive: true, createdAt: "2024-01-01T00:00:00.000Z" }
```

## Usage in tests

```ts
import { describe, it, expect } from "vitest";
import { mockTask } from "@shipyard/testing";
import { useKanbanStore } from "../stores/kanban-store";

it("addTask appends to the store", () => {
  useKanbanStore.setState({ tasks: [] });
  useKanbanStore.getState().addTask(mockTask());
  expect(useKanbanStore.getState().tasks).toHaveLength(1);
});
```
