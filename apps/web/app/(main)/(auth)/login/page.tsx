import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { LoginButtons } from "./login-buttons";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  // Permission check in page.tsx — never in layout.tsx
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Shipyard</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue to your workspace</p>
      </div>

      <LoginButtons />

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
