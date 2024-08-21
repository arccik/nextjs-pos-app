"use client";
import { Card } from "@/components/ui/card";

import KitchenOrderDisplay from "./KitchenOrderDisplay";
import { api } from "@/trpc/react";
import Loading from "@/components/Loading";

export default function KitchenPage() {
  const { data, isLoading } = api.order.getAll.useQuery("In Progress");
  console.log("Must be server compoonenntS:: >>> >> .> .> >>>>> ..>> ", data);
  return (
    <main className="sm:p-2">
      <Card className="p-5">
        <h1 className="text-4xl font-bold">Kitchen</h1>
        <p className="mt-2 text-gray-400">This is the kitchen page.</p>
        {isLoading && <Loading />}

        {!data?.length ? (
          <p className="my-10 text-center text-gray-400">
            No orders to display
          </p>
        ) : (
          <KitchenOrderDisplay data={data} />
        )}
      </Card>
    </main>
  );
}
