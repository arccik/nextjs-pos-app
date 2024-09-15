"use client";

import KitchenOrderDisplay from "./KitchenOrderDisplay";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Utensils } from "lucide-react";

export default function KitchenPage() {
  const { data, isLoading } = api.order.getAllByToday.useQuery("In Progress");
  const { data: totalCookedItems } = api.cookedItem.getTodayTotal.useQuery();
  const totalOrders = data?.length;

  return (
    <main className="p-2 sm:p-5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl font-bold">Kitchen</h1>
          <p className="mt-2 text-gray-400">This is the kitchen page.</p>
        </div>
        {/* section to show total order and total cooked items */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cooked Items
              </CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCookedItems}</div>
            </CardContent>
          </Card>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : !!data?.length ? (
        <KitchenOrderDisplay data={data} />
      ) : (
        <p className="my-10 text-center text-gray-400">No orders to display</p>
      )}
    </main>
  );
}
