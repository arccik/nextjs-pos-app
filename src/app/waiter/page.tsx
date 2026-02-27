"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  User2Icon,
  CheckCircle,
  ShoppingBasket,
  TableIcon,
} from "lucide-react";
import SelectTableDialog from "./SelectTable";
import { useSession } from "next-auth/react";
import TableCards from "@/app/tables/TableCards";
import { api } from "@/trpc/react";
import OrderCard from "@/app/orders/OrderCard";
import Loading from "@/components/Loading";
import { type OrderStatus } from "@/server/db/schemas";

type Tab = "orders" | "completedOrders" | "tables" | null;

export default function Waiter() {
  const { data: userData } = useSession();
  const [selectedTab, setSelectedTab] = useState<Tab>(null);

  const isOrdersTab =
    selectedTab === "orders" || selectedTab === "completedOrders";
  const orderStatus: OrderStatus[number] | undefined =
    selectedTab === "orders"
      ? "In Progress"
      : selectedTab === "completedOrders"
        ? "Completed"
        : undefined;

  const { data: orders, isLoading } = api.order.getAllByToday.useQuery(
    orderStatus,
    { enabled: isOrdersTab },
  );

  const handleTabClick = (value: Tab) => {
    setSelectedTab(selectedTab === value ? null : value);
  };

  return (
    <main className="space-y-5 p-4">
      <p className="text-sm">
        Welcome back <b>{userData?.user.name}</b>
      </p>

      <div className="grid grid-cols-2 place-content-center items-center justify-center gap-4 md:grid-cols-4">
        <SelectTableDialog
          buttonTrigger={
            <Button className="h-24" size="lg" variant="outline">
              <div className="flex flex-col items-center gap-1">
                <User2Icon className="h-6 w-6" />
                <span className="text-sm font-medium leading-none">New</span>
              </div>
            </Button>
          }
        />
        <Button
          onClick={() => handleTabClick("orders")}
          className="h-24"
          size="lg"
          variant={selectedTab === "orders" ? "default" : "outline"}
        >
          <div className="flex flex-col items-center gap-1">
            <ShoppingBasket className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">Orders</span>
          </div>
        </Button>
        <Button
          onClick={() => handleTabClick("completedOrders")}
          className="h-24"
          size="lg"
          variant={selectedTab === "completedOrders" ? "default" : "outline"}
        >
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">
              Completed Orders
            </span>
          </div>
        </Button>
        <Button
          onClick={() => handleTabClick("tables")}
          className="h-24"
          size="lg"
          variant={selectedTab === "tables" ? "default" : "outline"}
        >
          <div className="flex flex-col items-center gap-1">
            <TableIcon className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">Tables</span>
          </div>
        </Button>
      </div>

      {isOrdersTab &&
        (isLoading ? (
          <Loading />
        ) : orders?.length ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <p className="my-10 text-center font-sans text-gray-600">
            No orders found
          </p>
        ))}

      {selectedTab === "tables" && <TableCards standalone />}
    </main>
  );
}
