"use client";
import { Card } from "@/components/ui/card";

import KitchenOrderDisplay from "./KitchenOrderDisplay";
import { db } from "@/server/db";
import { items, orderItems, orders, tables, users } from "@/server/db/schemas";
import { getTableColumns, eq } from "drizzle-orm";
import { api } from "@/trpc/react";
import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import Loading from "@/components/Loading";

export default function KitchenPage() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["orders"],
  //     queryFn: getOrderItems,
  //   });
  const { password, ...rest } = getTableColumns(users);
  // const data = await db
  //   .select({
  //     order_items: orderItems,
  //     orders: orders,
  //     items: items,
  //     users: rest,
  //     tables: tables,
  //   })
  //   .from(orderItems)
  //   .where(eq(orders.status, "In Progress"))
  //   .leftJoin(orders, eq(orderItems.orderId, orders.id))
  //   .leftJoin(items, eq(orderItems.itemId, items.id))
  //   .leftJoin(users, eq(orders.userId, users.id))
  //   .leftJoin(tables, eq(orders.tableId, tables.id));
  const { data, isLoading } = api.order.getAll.useQuery("Pending");
  console.log("Must be server compoonenntS:: >>> >> .> .> >>>>> ..>> ", data);
  return (
    <main className="sm:p-2">
      <Card className="p-5">
        <h1 className="text-4xl font-bold">Kitchen</h1>
        <p className="mt-2 text-gray-400">This is the kitchen page.</p>
        {isLoading && <Loading />}
        {/* {data && (
          <DataTable data={data} columns={columns} searchField="orderId" />
        )} */}
        {!data?.length ? (
          <p className="my-10 text-center text-gray-400">
            No orders to display
          </p>
        ) : (
          <KitchenOrderDisplay data={data} />
          // <p>gello</p>
          // <pre>{JSON.stringify(data, undefined, 2)}</pre>
        )}
      </Card>
    </main>
  );
}
