import { db } from "@shipyard/db";
import { auth } from "./auth";
import type { Context } from "@shipyard/api/server/context";

export async function createTRPCContext(): Promise<Context> {
  const session = await auth();
  return { session, db };
}
