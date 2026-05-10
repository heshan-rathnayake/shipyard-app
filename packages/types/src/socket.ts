// Socket event types — shared between apps/socket (server) and apps/web (client).

import type { Task, TaskStatus } from "./task.js";

export interface PresenceUser {
  userId: string;
  name: string | null;
  image: string | null;
}

// ─── Client → Server ─────────────────────────────────────────────────────────

export interface ClientToServerEvents {
  "presence:join": (data: { projectId: string }) => void;
  "presence:leave": (data: { projectId: string }) => void;
  "task:created": (data: { projectId: string; task: Task }) => void;
  "task:updated": (data: { projectId: string; task: Task }) => void;
  "task:deleted": (data: { projectId: string; taskId: string }) => void;
  "task:moved": (data: {
    projectId: string;
    taskId: string;
    status: TaskStatus;
    position: number;
  }) => void;
  "task:reordered": (data: {
    projectId: string;
    tasks: { id: string; position: number }[];
  }) => void;
}

// ─── Server → Client ─────────────────────────────────────────────────────────

export interface ServerToClientEvents {
  "presence:update": (data: {
    projectId: string;
    users: PresenceUser[];
  }) => void;
  "task:created": (data: { projectId: string; task: Task }) => void;
  "task:updated": (data: { projectId: string; task: Task }) => void;
  "task:deleted": (data: { projectId: string; taskId: string }) => void;
  "task:moved": (data: {
    projectId: string;
    taskId: string;
    status: TaskStatus;
    position: number;
  }) => void;
  "task:reordered": (data: {
    projectId: string;
    tasks: { id: string; position: number }[];
  }) => void;
}

// ─── Per-socket server-side data ─────────────────────────────────────────────

export interface SocketData {
  userId: string;
  userName: string | null;
  userImage: string | null;
}
