# @shipyard/logger

Shared logger instance for Shipyard. Wraps [tslog](https://tslog.js.org) with environment-aware configuration — pretty output in development, JSON in production.

## Usage

```ts
import { logger } from "@shipyard/logger";

logger.debug("tRPC procedure called", { procedure: "task.create" });
logger.info("Organisation created", { orgId, name });
logger.warn("Plan limit reached", { orgId, tier, limit, current });
logger.error("Failed to send email", { to, error });
```

## Log levels

| Level | Method | Active in |
|-------|--------|-----------|
| 2 — Debug | `.debug()` | Development |
| 3 — Info | `.info()` | Development + Production |
| 4 — Warn | `.warn()` | Development + Production |
| 5 — Error | `.error()` | Development + Production |

## Output format

| `NODE_ENV` | Format |
|------------|--------|
| `development` | Pretty-printed (coloured, human-readable) |
| `production` | JSON (structured, machine-readable) |

## When to use each level

| Level | Use for |
|-------|---------|
| `debug` | Dev-only tracing — procedure calls, store actions |
| `info` | Key business events — org created, member invited, task deleted |
| `warn` | Expected failures — plan limit reached, FORBIDDEN throws |
| `error` | Unexpected failures — uncaught DB errors, failed email delivery |
