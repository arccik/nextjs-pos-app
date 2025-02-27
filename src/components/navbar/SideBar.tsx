"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";

import navItems from "./NavItems";
import MobileNav from "./MobileNav";

import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../DarkModeToggle";

export default function SideBar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isCurrentPath = (path: string) => path === pathname;

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };
  if (!session) return null;
  return (
    <>
      <aside className="no-print fixed inset-y-0 left-0 z-10 hidden flex-col overflow-auto border-r bg-background sm:flex md:w-20">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
            {navItems.map((navItem) => (
              <Tooltip key={navItem.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={navItem.link}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <navItem.icon
                      className={cn(
                        "size-5 transition-all duration-300 ease-in-out",
                        isCurrentPath(navItem.link) &&
                          "size-10 text-slate-900 dark:text-slate-100",
                      )}
                    />
                    <span className="sr-only">{navItem.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{navItem.title}</TooltipContent>
              </Tooltip>
            ))}
            <ModeToggle />
          </nav>
          <nav className="mt-auto flex rotate-180 flex-col items-center gap-4 px-2 sm:py-4">
            <p className="text-xl font-bold uppercase [writing-mode:vertical-rl]">
              <Link
                href={`/user/profile/${session.user.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                {session?.user.name}
              </Link>
            </p>
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/settings"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  onClick={handleLogOut}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <LogOut className="h-5 w-5 text-destructive/60" />
                  <span className="sr-only">Log Out</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">Log Out</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>
      <MobileNav />
    </>
  );
}
