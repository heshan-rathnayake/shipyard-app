import { logger } from "@shipyard/logger";
import type { AppSocket } from "../middleware/auth.js";

export function registerTaskHandlers(socket: AppSocket) {
  const { userId } = socket.data;

  socket.on("task:created", (data) => {
    logger.debug("task:created", { userId, projectId: data.projectId });
    socket.to(`project:${data.projectId}`).emit("task:created", data);
  });

  socket.on("task:updated", (data) => {
    socket.to(`project:${data.projectId}`).emit("task:updated", data);
  });

  socket.on("task:deleted", (data) => {
    socket.to(`project:${data.projectId}`).emit("task:deleted", data);
  });

  socket.on("task:moved", (data) => {
    socket.to(`project:${data.projectId}`).emit("task:moved", data);
  });

  socket.on("task:reordered", (data) => {
    socket.to(`project:${data.projectId}`).emit("task:reordered", data);
  });
}
