import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = { title: "Create account" };

export default async function SignupPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start shipping with your team
        </p>
      </div>

      <SignupForm />
    </div>
  );
}
