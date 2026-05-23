import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextThemeProvider } from "@/src/providers/next-theme-provider";
import "./globals.css";

const calSans = Geist({
  variable: "--font-cal-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Shipyard",
    default: "Shipyard — Project management for dev teams",
  },
  description:
    "Shipyard is an open-source project management tool for small software teams. Simpler than Jira. Built with Next.js, tRPC, and Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${calSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <NextThemeProvider>{children}</NextThemeProvider>
      </body>
    </html>
  );
}
