"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { Settings } from "lucide-react";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { LogOut, Settings } from "lucide-react";
import navItems from "./navItems";

export default function SideBar() {
  // const auth = useSession();
  // //   const signOut = useSignOut();

  // const handleLogOut = async () => {
  //   await signOut({ callbackUrl: "/goodbye" });
  // };
  // if (!auth) return null;
  return (
    <>
      <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r sm:flex">
        <TooltipProvider>
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
            {navItems.map((navItem) => (
              <Tooltip key={navItem.id}>
                <TooltipTrigger asChild>
                  <Link
                    href={navItem.link}
                    className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                  >
                    <navItem.icon className="h-5 w-5" />
                    <span className="sr-only">{navItem.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{navItem.title}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/admin/settings"
                  className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
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
                  // onClick={async () => await handleLogOut()}
                  className="text-muted-foreground hover:text-foreground flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors md:h-8 md:w-8"
                >
                  <LogOut className="text-destructive/60 h-5 w-5" />
                  <span className="sr-only">Log Out</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">Log Out</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </aside>
      <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <div className="flex w-full md:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <TriangleDownIcon className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="h-full sm:h-max sm:max-w-[425px]">
              <NavigationMenu className="mx-auto">
                <NavigationMenuList className="grid grid-cols-2 gap-1 p-2 md:grid-cols-3">
                  {navItems.map((item) => (
                    <DialogClose
                      key={item.id}
                      asChild
                      className="flex size-28 flex-col items-center justify-center rounded-lg border border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700"
                    >
                      <Link href={item.link} className="text-gray-400">
                        <item.icon className="size-10" />

                        {item.title}
                      </Link>
                    </DialogClose>
                  ))}
                  <DialogClose
                    asChild
                    className="flex size-28 flex-col items-center justify-center rounded-lg border border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700"
                  >
                    <span
                    // onClick={async () => await handleLogOut()}
                    >
                      <LogOut className="text-destructive size-10" />
                      <span className="sr-only">Log Out</span>
                    </span>
                  </DialogClose>
                </NavigationMenuList>
              </NavigationMenu>
            </DialogContent>
          </Dialog>
        </div>
      </header>
    </>
  );
}
