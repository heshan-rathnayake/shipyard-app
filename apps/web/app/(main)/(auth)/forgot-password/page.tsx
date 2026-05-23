import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

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
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
