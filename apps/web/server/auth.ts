import { authConfig } from "./auth.config"
import NextAuth, { type NextAuthResult } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@shipyard/db"

const result: NextAuthResult = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
})

export const handlers: NextAuthResult["handlers"] = result.handlers
export const auth: NextAuthResult["auth"] = result.auth
export const signIn: NextAuthResult["signIn"] = result.signIn
export const signOut: NextAuthResult["signOut"] = result.signOut