import { Separator } from "@shipyard/ui/components/separator";
import { db } from "@shipyard/db";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { ChangePasswordForm } from "./_components/change-password-form";
import { DeleteAccountButton } from "./_components/delete-account-button";
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

  const hasPassword = !!user?.password;

  // Build provider list — include "credentials" if they have a password row
  const providers = [
    ...(user?.accounts.map((a) => a.provider) ?? []),
    ...(hasPassword ? ["credentials"] : []),
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

      {/* Password — credentials users only */}
      {hasPassword && (
        <>
          <section className="space-y-3">
            <div>
              <h2 className="text-base font-semibold">Password</h2>
              <p className="text-sm text-muted-foreground">
                Update the password used to sign in to your account.
              </p>
            </div>
            <ChangePasswordForm />
          </section>

          <Separator />
        </>
      )}

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

      <Separator />

      {/* Danger zone */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-destructive">
            Danger zone
          </h2>
          <p className="text-sm text-muted-foreground">
            Irreversible actions that affect your entire account.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete this account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and remove you from all
                organizations. You must delete or transfer any organizations you
                solely own first.
              </p>
            </div>
            <div className="shrink-0">
              <DeleteAccountButton email={user?.email ?? ""} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
