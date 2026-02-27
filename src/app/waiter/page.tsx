"use client";

import { useState } from "react";
import {
  PlusCircle,
  ShoppingBasket,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";
import SelectTableDialog from "./SelectTable";
import { useSession } from "next-auth/react";
import TableCards from "@/app/tables/TableCards";
import { api } from "@/trpc/react";
import OrderCard from "@/app/orders/OrderCard";
import Loading from "@/components/Loading";
import { type OrderStatus } from "@/server/db/schemas";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

type Tab = "orders" | "completedOrders" | "tables" | null;

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

type TileProps = {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  active: boolean;
  onClick: () => void;
  inactiveTop: string;
  inactiveBg: string;
  inactiveText: string;
  activeBg: string;
};

function Tile({
  icon,
  label,
  subLabel,
  active,
  onClick,
  inactiveTop,
  inactiveBg,
  inactiveText,
  activeBg,
}: TileProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full flex-col items-center gap-2 rounded-xl border border-t-4 px-3 py-5 transition-all",
        active
          ? cn(activeBg, "border-transparent text-white")
          : cn(inactiveTop, inactiveBg, inactiveText, "hover:opacity-80"),
      )}
    >
      {icon}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-semibold leading-none">{label}</span>
        {subLabel && (
          <span className={cn("text-xs leading-none", active ? "opacity-75" : "opacity-60")}>
            {subLabel}
          </span>
        )}
      </div>
    </button>
  );
}

export default function Waiter() {
  const { data: userData } = useSession();
  const [selectedTab, setSelectedTab] = useState<Tab>(null);

  const isOrdersTab = selectedTab === "orders" || selectedTab === "completedOrders";
  const orderStatus: OrderStatus[number] | undefined =
    selectedTab === "orders"
      ? "In Progress"
      : selectedTab === "completedOrders"
        ? "Completed"
        : undefined;

  const { data: orders, isLoading } = api.order.getAllByToday.useQuery(orderStatus, {
    enabled: isOrdersTab,
  });

  const handleTabClick = (value: Tab) => {
    setSelectedTab(selectedTab === value ? null : value);
  };

  const now = new Date();
  const firstName = userData?.user.name?.split(" ")[0];
  const greeting = getGreeting(now.getHours());

  const inProgressCount =
    selectedTab === "orders" && orders ? ` · ${orders.length}` : "";
  const completedCount =
    selectedTab === "completedOrders" && orders ? ` · ${orders.length}` : "";

  return (
    <main className="space-y-6 p-4">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">{format(now, "EEEE, d MMMM")}</p>
        <h1 className="text-2xl font-bold">
          {greeting}
          {firstName ? `, ${firstName}` : ""}
        </h1>
      </div>

      {/* Action tiles */}
      <div className="grid grid-cols-2 gap-3">
        {/* New Order — opens select-table dialog */}
        <SelectTableDialog
          buttonTrigger={
            <button className="flex w-full flex-col items-center gap-2 rounded-xl border border-t-4 border-t-green-500 bg-green-50/40 px-3 py-5 text-green-700 transition-all hover:opacity-80 dark:bg-green-950/20 dark:text-green-400">
              <PlusCircle className="h-7 w-7" />
              <span className="text-sm font-semibold leading-none">New Order</span>
            </button>
          }
        />

        {/* In Progress */}
        <Tile
          icon={<ShoppingBasket className="h-7 w-7" />}
          label="In Progress"
          subLabel={inProgressCount ? `${orders?.length} orders` : undefined}
          active={selectedTab === "orders"}
          onClick={() => handleTabClick("orders")}
          inactiveTop="border-t-amber-500"
          inactiveBg="bg-amber-50/40 dark:bg-amber-950/20"
          inactiveText="text-amber-700 dark:text-amber-400"
          activeBg="bg-amber-500"
        />

        {/* Completed */}
        <Tile
          icon={<CheckCircle className="h-7 w-7" />}
          label="Completed"
          subLabel={completedCount ? `${orders?.length} orders` : undefined}
          active={selectedTab === "completedOrders"}
          onClick={() => handleTabClick("completedOrders")}
          inactiveTop="border-t-slate-400"
          inactiveBg="bg-slate-50/60 dark:bg-slate-900/20"
          inactiveText="text-slate-600 dark:text-slate-400"
          activeBg="bg-slate-600"
        />

        {/* Tables */}
        <Tile
          icon={<LayoutGrid className="h-7 w-7" />}
          label="Tables"
          active={selectedTab === "tables"}
          onClick={() => handleTabClick("tables")}
          inactiveTop="border-t-blue-500"
          inactiveBg="bg-blue-50/40 dark:bg-blue-950/20"
          inactiveText="text-blue-700 dark:text-blue-400"
          activeBg="bg-blue-500"
        />
      </div>

      {/* Content panel */}
      {isOrdersTab && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="font-semibold">
              {selectedTab === "orders" ? "In Progress" : "Completed"} Orders
            </h2>
            {orders && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {orders.length}
              </span>
            )}
          </div>

          {isLoading ? (
            <Loading />
          ) : orders?.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <p className="my-10 text-center text-sm text-muted-foreground">No orders found</p>
          )}
        </div>
      )}

      {selectedTab === "tables" && <TableCards standalone />}
    </main>
  );
}
