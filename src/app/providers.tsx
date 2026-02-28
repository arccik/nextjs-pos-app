"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";
import { OnlineStatusProvider } from "@/lib/onlineStatus";
import { useSocket } from "@/hooks/useSocket";

// Recharts 2.x uses legacy defaultProps which React 18 warns about.
// This filter avoids noise until recharts v3 is adopted.
function SuppressRechartsWarnings() {
  useEffect(() => {
    const orig = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps will be removed")
      )
        return;
      orig(...args);
    };
    return () => {
      console.error = orig;
    };
  }, []);
  return null;
}

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
            <SuppressRechartsWarnings />
            <SocketInitializer />
            {children}
          </OnlineStatusProvider>
        </TRPCReactProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
