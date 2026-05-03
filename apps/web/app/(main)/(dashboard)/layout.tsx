import { auth, signOut } from "@/server/auth";
import { Button } from "@shipyard/ui/components/button";
import Link from "next/link";

// Auth is read here for display only — redirects live in page.tsx per convention
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href="/dashboard" className="text-lg font-bold tracking-tight">
            Shipyard
          </Link>
          {session?.user && (
            <span className="text-sm text-muted-foreground">
              {session.user.email}
            </span>
          )}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button type="submit" variant="ghost">
              Logout
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
