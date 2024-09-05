"use client";

import KitchenOrderDisplay from "./KitchenOrderDisplay";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";

export default function KitchenPage() {
  const { data, isLoading } = api.order.getAllByToday.useQuery("In Progress");
  const { data: cookedItems } = api.cookedItem.getTodayTotal.useQuery();
  return (
    <main className="p-2 sm:p-5">
      <div className="flex justify-between">
        <div>
          <h1 className="text-4xl font-bold">Kitchen</h1>
          <p className="mt-2 text-gray-400">This is the kitchen page.</p>
        </div>
        <div>
          <p className="text-2xl text-gray-400">
            Total Orders {data?.length} / {cookedItems}
          </p>
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
