"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { TRPCReactProvider } from "@/trpc/react";


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
