import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/toaster";
import { TRPCReactProvider } from "@/trpc/react";
import SideBar from "@/components/navbar/SideBar";
import { Providers } from "./providers";

export const metadata = {
  title: "Point Of Sales | 4D Comfort",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="ml-0 sm:ml-20">
        <Providers>
          <SideBar />
          <TRPCReactProvider>{children}</TRPCReactProvider>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
