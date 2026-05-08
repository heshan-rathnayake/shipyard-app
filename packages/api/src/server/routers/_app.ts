import { router } from "../trpc";
import { organizationRouter } from "./organization";
import { memberRouter } from "./member";
import { activityLogRouter } from "./activityLog";
import { projectRouter } from "./project";
import { taskRouter } from "./task";
import { commentRouter } from "./comment";

export const appRouter = router({
  organization: organizationRouter,
  member: memberRouter,
  activityLog: activityLogRouter,
  project: projectRouter,
  task: taskRouter,
  comment: commentRouter,
});

export type AppRouter = typeof appRouter;
