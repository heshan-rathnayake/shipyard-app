import { router } from "../trpc";
import { activityLogRouter } from "./activityLog";
import { commentRouter } from "./comment";
import { dashboardRouter } from "./dashboard";
import { memberRouter } from "./member";
import { organizationRouter } from "./organization";
import { projectRouter } from "./project";
import { searchRouter } from "./search";
import { socketRouter } from "./socket";
import { subscriptionRouter } from "./subscription";
import { taskRouter } from "./task";
import { userRouter } from "./user";

export const appRouter = router({
  organization: organizationRouter,
  dashboard: dashboardRouter,
  member: memberRouter,
  activityLog: activityLogRouter,
  project: projectRouter,
  task: taskRouter,
  comment: commentRouter,
  socket: socketRouter,
  subscription: subscriptionRouter,
  search: searchRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
