import type { Session } from "next-auth";
import type { db as DB } from "@shipyard/db";

export interface Context {
  session: Session | null;
  db: typeof DB;
}
