import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "@/src/providers/trpc-react-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}
