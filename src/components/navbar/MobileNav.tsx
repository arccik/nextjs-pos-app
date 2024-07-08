import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { LogOut, Settings } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import navItems from "./NavItems";

export default function MobileNav() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex w-full md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TriangleDownIcon className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-full sm:h-max sm:max-w-[425px]">
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="grid grid-cols-2 gap-1 md:grid-cols-3">
                {navItems.map((item) => (
                  <DialogClose
                    key={item.id}
                    asChild
                    className="flex size-40 flex-col items-center justify-center rounded-lg border-2 border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700"
                  >
                    <Link href={item.link} className="text-gray-400">
                      <item.icon className="size-16" />

                      {item.title}
                    </Link>
                  </DialogClose>
                ))}
                <DialogClose
                  asChild
                  className="flex size-40 flex-col items-center justify-center rounded-lg border-2 border-destructive/50 border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700"
                >
                  <span
                  // onClick={async () => await handleLogOut()}
                  >
                    <LogOut className="size-10 text-destructive" />
                    <span className="text-destructive">Log Out</span>
                  </span>
                </DialogClose>
              </NavigationMenuList>
            </NavigationMenu>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
