# @shipyard/socket

Real-time Socket.io server for Shipyard. Handles live Kanban board updates and user presence across project rooms.

## Responsibilities

- **Task events** — broadcasts task mutations (create, update, delete, move, reorder) to every other client in the same project room
- **Presence** — tracks who is viewing each project and emits live user lists

## Architecture

```
apps/web  ──(JWT)──►  auth middleware  ──►  socket connection
                                                │
                           ┌────────────────────┤
                           ▼                    ▼
                   presence handlers      task handlers
                   (presence:join/leave)  (task:created/updated/…)
                           │
                           ▼
                   io.to("project:<id>").emit(…)
```

Rooms are keyed as `project:<projectId>`. The socket server does **not** write to the database for task events — it only rebroadcasts. Presence join/leave events do query the database to verify org membership before admitting a socket to a room.

## Events

See [`@shipyard/types`](../../packages/types/README.md) for full payload types.

### Client → Server

| Event | Description |
|-------|-------------|
| `presence:join` | Join a project room; server validates membership |
| `presence:leave` | Leave a project room |
| `task:created` | Broadcast new task to room peers |
| `task:updated` | Broadcast task field changes to room peers |
| `task:deleted` | Broadcast task removal to room peers |
| `task:moved` | Broadcast status/position change to room peers |
| `task:reordered` | Broadcast bulk position update to room peers |

### Server → Client

| Event | Description |
|-------|-------------|
| `presence:update` | Current list of online users in a project room |
| `task:created/updated/deleted/moved/reordered` | Mirrored back to all room peers except the sender |

## Authentication

Every connection must supply a signed JWT in `socket.handshake.auth.token`. The token is issued by `apps/web` via the `socket.getToken` tRPC procedure and signed with `SOCKET_SECRET`.

Connections without a valid token are rejected with an `UNAUTHORIZED` error.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SOCKET_PORT` | `4000` | Port the server listens on |
| `SOCKET_SECRET` | — | **Required.** JWT signing secret (must match `apps/web`) |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Allowed CORS origin |
| `DATABASE_URL` | — | PostgreSQL connection string (used for membership checks) |
| `NODE_ENV` | — | `development` or `production` |

## Development

From the monorepo root:

```sh
yarn dev
```

To run only the socket server:

```sh
yarn workspace @shipyard/socket dev
```

The server starts on port `4000` by default. The web app connects to it via `NEXT_PUBLIC_SOCKET_URL`.

## Health check

```
GET /health  →  { ok: true, service: "shipyard-socket" }
```
