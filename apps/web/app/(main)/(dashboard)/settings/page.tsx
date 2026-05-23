import { Separator } from "@shipyard/ui/components/separator";
import type { Metadata } from "next";
import { auth } from "@/server/auth";
import { db } from "@shipyard/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "./_components/profile-form";
import { ThemeSelector } from "./_components/theme-selector";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
      accounts: { select: { provider: true } },
      password: { select: { createdAt: true } },
    },
  });

  // Build provider list — include "credentials" if they have a password row
  const providers = [
    ...(user?.accounts.map((a) => a.provider) ?? []),
    ...(user?.password ? ["credentials"] : []),
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account preferences and profile.
        </p>
      </div>

      <Separator />

      {/* Profile */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            Your public display name shown across Shipyard.
          </p>
        </div>
        <ProfileForm
          name={user?.name ?? null}
          email={user?.email ?? null}
          image={user?.image ?? null}
          providers={providers}
        />
      </section>

      <Separator />

      {/* Appearance */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">
            Choose how Shipyard looks for you.
          </p>
        </div>
        <ThemeSelector />
      </section>
    </div>
  );
}
