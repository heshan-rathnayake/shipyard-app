import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { LoginButtons } from "./login-buttons";

export const metadata: Metadata = { title: "Sign in" };

const AUTH_ERRORS: Record<string, string> = {
  // OAuth
  OAuthAccountNotLinked:
    "An account with this email already exists. Sign in with the provider you used originally.",
  OAuthCallbackError:
    "Something went wrong with the sign-in. Please try again.",
  AccessDenied: "Access was denied. Please try again.",
  CredentialsSignin:
    "Invalid email or password. If you recently signed up, check your inbox for the verification link.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    verified?: string;
    reset?: string;
    callbackUrl?: string;
  }>;
}) {
  // Permission check in page.tsx — never in layout.tsx
  const session = await auth();
  if (session) redirect("/dashboard");

  const { error, verified, reset, callbackUrl } = await searchParams;
  const isVerified = verified === "true";
  const isReset = reset === "true";
  const errorMessage = error
    ? (AUTH_ERRORS[error] ?? "An unexpected error occurred. Please try again.")
    : null;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <Link
        href="/"
        className="absolute top-4 left-4 flex w-fit items-center gap-2.5"
      >
        <Image
          src="/logo.png"
          alt="Shipyard logo"
          width={28}
          height={28}
          className="shrink-0"
        />
        <span className="text-[15px] font-semibold tracking-tight">
          Shipyard
        </span>
      </Link>
      <div className="flex w-full overflow-hidden rounded-lg bg-muted/40 md:max-w-4xl">
        {/* ── Left: form panel ── */}
        <div className="flex w-full flex-col px-8 py-10 md:w-1/2 md:px-10">
          {/* Form — flex-1 so it stretches and justify-center to vertically centre it */}
          <div className="flex flex-1 flex-col justify-center py-8">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-1.5">
                <h1 className="text-2xl font-bold tracking-tight">
                  Welcome back
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to your workspace to continue
                </p>
              </div>

              {isVerified && (
                <p className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-center text-sm text-green-700 dark:text-green-400">
                  Email verified! You can now sign in.
                </p>
              )}

              {isReset && (
                <p className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-center text-sm text-green-700 dark:text-green-400">
                  Password updated! Sign in with your new password.
                </p>
              )}

              {errorMessage && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
                  {errorMessage}
                </p>
              )}

              <LoginButtons callbackUrl={callbackUrl ?? "/dashboard"} />
            </div>
          </div>
        </div>

        {/* ── Right: brand panel (desktop only) ── */}
        <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-[oklch(93%_0.025_165)] dark:bg-[oklch(12%_0.025_165)] md:flex">
          {/* Dot-grid overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(oklch(50.8%_0.118_165.612_/_0.1) 1px, transparent 1px), linear-gradient(90deg, oklch(50.8%_0.118_165.612_/_0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Radial glow */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 50%, oklch(50.8% 0.118 165.612 / 0.15) 0%, transparent 70%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
            <Image
              src="/logo.png"
              alt="Shipyard"
              width={76}
              height={76}
              className="drop-shadow-xl"
            />
            <div className="space-y-3">
              <p className="text-3xl font-bold tracking-tight text-[oklch(18%_0.04_165)] dark:text-[oklch(95%_0.03_165)]">
                Shipyard
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-[oklch(38%_0.06_165)] dark:text-[oklch(72%_0.05_165)]">
                Project management and team collaboration,
                <br />
                built for teams that move fast.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-4">
        By signing in, you agree to our{" "}
        <Link
          href="/terms"
          className="underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 transition-colors hover:text-foreground"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
