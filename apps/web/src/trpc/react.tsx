import { createTRPCReact, type CreateTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "@shipyard/api/server/routers/_app"

export const trpc: CreateTRPCReact<AppRouter, unknown> =
  createTRPCReact<AppRouter>();
