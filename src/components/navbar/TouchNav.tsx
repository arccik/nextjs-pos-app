"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  MoreHorizontal,
  LogOut,
  Settings,
  Play,
} from "lucide-react";
import {
  ConciergeBell,
  HomeIcon,
  BookOpenText,
  LineChart,
  BookMarked,
  Users2Icon,
  SquareChevronDown,
  Ham,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ModeToggle } from "../DarkModeToggle";
import TableIcon from "./TableIcon";
import ChefIcon from "./ChefIcon";

const PRIMARY_TABS = [
  { id: "tables", title: "Tables", icon: TableIcon, link: "/tables" },
  { id: "orders", title: "Orders", icon: ConciergeBell, link: "/orders" },
  { id: "waiter", title: "Waiter", icon: Play, link: "/waiter" },
  { id: "kitchen", title: "Kitchen", icon: ChefIcon, link: "/kitchen" },
] as const;

const MORE_ITEMS = [
  { id: "dashboard", title: "Dashboard", icon: HomeIcon, link: "/" },
  { id: "menu", title: "Menu", icon: BookOpenText, link: "/menu" },
  {
    id: "reservations",
    title: "Reservations",
    icon: BookMarked,
    link: "/reservations",
  },
  { id: "items", title: "Menu Items", icon: Ham, link: "/items" },
  { id: "analytics", title: "Analytics", icon: LineChart, link: "/analytics" },
  { id: "users", title: "Users", icon: Users2Icon, link: "/user" },
  { id: "rota", title: "Rota", icon: SquareChevronDown, link: "/user/rota" },
  { id: "settings", title: "Settings", icon: Settings, link: "/settings" },
] as const;

export default function TouchNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: allOrders } = api.order.getAllByToday.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  const pendingCount =
    allOrders?.filter((o) => o.status === "Pending").length ?? 0;
  const readyCount =
    allOrders?.filter((o) => o.status === "Ready").length ?? 0;
  const inProgressCount =
    allOrders?.filter((o) => o.status === "In Progress").length ?? 0;

  function getBadge(id: string) {
    if (id === "orders" && pendingCount > 0) return pendingCount;
    if (id === "kitchen" && readyCount > 0) return readyCount;
    if (id === "waiter" && inProgressCount > 0) return inProgressCount;
    return null;
  }

  const handleLogOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  if (!session) return null;

  return (
    <>
      <nav className="no-print fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center border-t bg-background">
        {PRIMARY_TABS.map((tab) => {
          const isActive = pathname === tab.link;
          const badge = getBadge(tab.id);
          return (
            <Link
              key={tab.id}
              href={tab.link}
              className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full p-2 transition-colors",
                  isActive && "bg-primary/10",
                )}
              >
                <tab.icon
                  className={cn(
                    "size-6 text-muted-foreground",
                    isActive && "text-primary",
                  )}
                />
                {badge !== null && (
                  <span className="absolute right-[calc(50%-18px)] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                    {badge}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-medium text-muted-foreground",
                  isActive && "text-primary",
                )}
              >
                {tab.title}
              </span>
            </Link>
          );
        })}

        {/* More button */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 py-2"
        >
          <span className="flex items-center justify-center rounded-full p-2">
            <MoreHorizontal className="size-6 text-muted-foreground" />
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">
            More
          </span>
        </button>
      </nav>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="pb-safe">
          <DrawerTitle className="sr-only">More navigation options</DrawerTitle>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-3">
              {MORE_ITEMS.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <DrawerClose key={item.id} asChild>
                    <Link
                      href={item.link}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl p-3 transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted",
                      )}
                    >
                      <item.icon className="size-6" />
                      <span className="text-center text-xs font-medium leading-tight">
                        {item.title}
                      </span>
                    </Link>
                  </DrawerClose>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 border-t px-4 py-3">
            <ModeToggle className="flex-1" />
            <button
              onClick={handleLogOut}
              className="flex flex-1 items-center justify-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
