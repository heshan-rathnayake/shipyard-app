import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    // Explicit fields — avoids DefaultSession["user"] which is typed User | undefined
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}