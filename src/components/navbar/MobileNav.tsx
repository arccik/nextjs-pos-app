// import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import navItems from "./NavItems";
import { DialogTitle } from "@radix-ui/react-dialog";
import { signOut } from "next-auth/react";
import { ModeToggle } from "../DarkModeToggle";

export default function MobileNav() {
  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex w-full sm:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TriangleDownIcon className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent
            className="h-full sm:h-max sm:max-w-[425px]"
            title="Navigation menu"
          >
            <NavigationMenu className="mx-auto">
              <NavigationMenuList className="grid grid-cols-3 gap-3 md:grid-cols-3">
                {navItems.map((item) => (
                  <DialogClose
                    key={item.id}
                    asChild
                    className="flex size-24 flex-col items-center justify-center rounded-lg border-2 border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700 dark:text-slate-300 "
                  >
                    <Link href={item.link} className="text-gray-400">
                      <item.icon className="size-10 font-thin " />

                      {item.title}
                    </Link>
                  </DialogClose>
                ))}
                <DialogClose
                  asChild
                  className="flex size-24 flex-col items-center justify-center rounded-lg border-2 border-destructive/50 border-gray-100 p-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-100/50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-700"
                >
                  <span onClick={handleLogOut}>
                    <LogOut className="size-10 text-destructive" />
                    <span className="text-destructive">Log Out</span>
                  </span>
                </DialogClose>

                <DialogTitle></DialogTitle>
              </NavigationMenuList>
            </NavigationMenu>
            <DialogDescription>
              <ModeToggle className="w-full" />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
