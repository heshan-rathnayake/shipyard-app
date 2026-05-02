import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@shipyard/api/server/routers/_app";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
