import { router } from "../trpc";
import { organizationRouter } from "./organization";
import { memberRouter } from "./member";
import { activityLogRouter } from "./activityLog";

export const appRouter = router({
  organization: organizationRouter,
  member: memberRouter,
  activityLog: activityLogRouter,
});

export type AppRouter = typeof appRouter;
