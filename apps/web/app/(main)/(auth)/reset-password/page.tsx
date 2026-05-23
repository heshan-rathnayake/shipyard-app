import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const session = await auth();
  if (session) redirect("/dashboard");

  const { token, email } = await searchParams;

  const isInvalidLink = !token || !email;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Brand mark */}
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

      <div className="w-full max-w-sm">
        {isInvalidLink ? (
          <div className="space-y-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Invalid link</h1>
            <p className="text-sm text-muted-foreground">
              This password reset link is missing required parameters.
            </p>
            <Link
              href="/forgot-password"
              className="text-sm underline underline-offset-4"
            >
              Request a new reset link
            </Link>
          </div>
        ) : (
          <ResetPasswordForm token={token} email={email} />
        )}
      </div>
    </div>
  );
}
