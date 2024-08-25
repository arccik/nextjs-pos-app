"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderCard from "./OrderCard";
import { type OrderStatus } from "@/server/db/schemas";
import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import AddNewOrderButton from "./AddNewOrderButton";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";

type OrderProps = {
  orderStatus?: OrderStatus[number];
};
export default function Orders({ orderStatus }: OrderProps) {
  const [status, setStatus] = useState<OrderStatus[number] | undefined>(
    orderStatus,
  );
  //TODO: make api requiest with limit and offset

  const { data, isLoading } = api.order.getAll.useQuery(status);
  console.log("Orders", { data, status });

  const total = data?.length;
  return (
    <main className="p-2">
      <Card>
        <ToggleGroup
          type="single"
          value={status}
          onValueChange={(e: OrderStatus[number]) => setStatus(e)}
        >
          <ToggleGroupItem value="Ready">Ready</ToggleGroupItem>
          <ToggleGroupItem value="In Progress"> In Progress</ToggleGroupItem>
          <ToggleGroupItem value="Served"> Served</ToggleGroupItem>
          <ToggleGroupItem value="Completed"> Completed</ToggleGroupItem>
          <ToggleGroupItem value="Pending" className="border border-red-700/40">
            Pending
          </ToggleGroupItem>
        </ToggleGroup>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-semibold">
            Orders {status}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">{total}</div>

            <AddNewOrderButton />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            +180.1% from last month
          </p>
          <div className="mt-4">
            {!!data?.length ? (
              <div className="grid  gap-4 md:grid-cols-2 lg:justify-between xl:grid-cols-3">
                {data.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : isLoading ? (
              <Loading />
            ) : (
              <p className="my-10 text-center font-sans text-gray-600">
                No orders found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
