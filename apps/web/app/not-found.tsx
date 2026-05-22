import { Button } from "@shipyard/ui/components/button";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "404 — Page not found" };

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      {/* Subtle brand-tinted radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(50.8% 0.118 165.612 / 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(oklch(50.8% 0.118 165.612 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(50.8% 0.118 165.612 / 0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-2">
          <Image src="/logo.png" alt="Shipyard" width={36} height={36} />
          <span className="text-lg font-bold tracking-tight">Shipyard</span>
        </Link>

        {/* 404 display */}
        <div className="space-y-1">
          <p
            className="text-8xl font-extrabold tracking-tighter leading-none"
            style={{ color: "oklch(50.8% 0.118 165.612)" }}
          >
            404
          </p>
          <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Check the URL or head back to somewhere familiar.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard">Go to dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
