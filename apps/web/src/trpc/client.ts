import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@shipyard/api";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
    }),
  ],
});
