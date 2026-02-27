"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";
import { OnlineStatusProvider } from "@/lib/onlineStatus";
import { useSocket } from "@/hooks/useSocket";

function SocketInitializer() {
  useSocket();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <TRPCReactProvider>
          <OnlineStatusProvider>
            <SocketInitializer />
            {children}
          </OnlineStatusProvider>
        </TRPCReactProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
