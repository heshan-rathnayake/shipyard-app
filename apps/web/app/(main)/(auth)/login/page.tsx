import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { LoginButtons } from "./login-buttons";

export const metadata: Metadata = { title: "Sign in" };

const AUTH_ERRORS: Record<string, string> = {
  OAuthAccountNotLinked:
    "An account with this email already exists. Sign in with the provider you used originally.",
  OAuthCallbackError: "Something went wrong with the sign-in. Please try again.",
  AccessDenied: "Access was denied. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Permission check in page.tsx — never in layout.tsx
  const session = await auth();
  if (session) redirect("/dashboard");

  const { error } = await searchParams;
  const errorMessage = error ? (AUTH_ERRORS[error] ?? "An unexpected error occurred. Please try again.") : null;

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to Shipyard</h1>
        <p className="text-sm text-muted-foreground">Sign in to continue to your workspace</p>
      </div>

      {errorMessage && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          {errorMessage}
        </p>
      )}

      <LoginButtons />

      <p className="text-center text-xs text-muted-foreground">
        By signing in, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}
