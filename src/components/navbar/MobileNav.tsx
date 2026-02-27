"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { TriangleDownIcon } from "@radix-ui/react-icons";
import { ChevronRight, LogOut, Search, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ModeToggle } from "../DarkModeToggle";
import navItems, { type NavGroup } from "./NavItems";
import { api } from "@/trpc/react";

const GROUPS: NavGroup[] = ["Operations", "Service", "Admin"];

export default function MobileNav() {
  const [query, setQuery] = useState("");

  const { data: allOrders } = api.order.getAllByToday.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  const pendingCount =
    allOrders?.filter((o) => o.status === "Pending").length ?? 0;
  const readyCount =
    allOrders?.filter((o) => o.status === "Ready").length ?? 0;
  const inProgressCount =
    allOrders?.filter((o) => o.status === "In Progress").length ?? 0;

  function getBadge(title: string) {
    if (title === "Orders" && pendingCount > 0)
      return { label: `${pendingCount} new`, green: false };
    if (title === "Kitchen" && readyCount > 0)
      return { label: `${readyCount} ready`, green: true };
    if (title === "Waiter" && inProgressCount > 0)
      return { label: `${inProgressCount} upcoming`, green: false };
    return null;
  }

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;
  const filteredItems = isSearching
    ? navItems.filter((item) => item.title.toLowerCase().includes(trimmedQuery))
    : [];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex w-full sm:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <TriangleDownIcon className="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="flex h-full flex-col gap-0 p-0 sm:h-max sm:max-w-[425px] [&>button:last-child]:hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <DialogTitle className="text-base font-semibold">
                Navigation menu
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <X className="size-4" />
                </Button>
              </DialogClose>
            </div>

            {/* Search */}
            <div className="border-b px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            {/* Nav content */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {isSearching ? (
                /* Flat filtered list */
                filteredItems.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-lg border divide-y">
                    {filteredItems.map((item) => {
                      const badge = getBadge(item.title);
                      return (
                        <DialogClose key={item.id} asChild>
                          <Link
                            href={item.link}
                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                          >
                            <item.icon className="size-5 shrink-0 text-muted-foreground" />
                            <span className="flex-1 text-sm font-medium">
                              {item.title}
                            </span>
                            {badge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  badge.green
                                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {badge.label}
                              </span>
                            )}
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                          </Link>
                        </DialogClose>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Grouped sections */
                <div className="space-y-4">
                  {GROUPS.map((group) => {
                    const items = navItems.filter(
                      (item) => item.group === group,
                    );
                    if (items.length === 0) return null;
                    return (
                      <div key={group}>
                        <p className="mb-1.5 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {group}
                        </p>
                        <div className="overflow-hidden rounded-lg border divide-y">
                          {items.map((item) => {
                            const badge = getBadge(item.title);
                            return (
                              <DialogClose key={item.id} asChild>
                                <Link
                                  href={item.link}
                                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
                                >
                                  <item.icon className="size-5 shrink-0 text-muted-foreground" />
                                  <span className="flex-1 text-sm font-medium">
                                    {item.title}
                                  </span>
                                  {badge && (
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                        badge.green
                                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {badge.label}
                                    </span>
                                  )}
                                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                                </Link>
                              </DialogClose>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="space-y-2 border-t px-4 py-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogOut}
              >
                <LogOut className="mr-2 size-4" />
                Log Out
              </Button>
              <ModeToggle className="w-full" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
