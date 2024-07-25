import { Card } from "@/components/ui/card";
// import { useQuery } from "@tanstack/react-query";
// import { getOrderItems } from "@/api/orders";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
// import { columns } from "./columns";
// import { DataTable } from "@/components/Data-table";

import KitchenOrderDisplay from "./KitchenOrderDisplay";
import { db } from "@/server/db";
import { items, orderItems, orders, tables, users } from "@/server/db/schemas";
import { getTableColumns, eq } from "drizzle-orm";
import { api } from "@/trpc/server";

export default async function KitchenPage() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["orders"],
  //     queryFn: getOrderItems,
  //   });
  const { password, ...rest } = getTableColumns(users);
  const data = await db
    .select({
      order_items: orderItems,
      orders: orders,
      items: items,
      users: rest,
      tables: tables,
    })
    .from(orderItems)
    .where(eq(orders.status, "In Progress"))
    .leftJoin(orders, eq(orderItems.orderId, orders.id))
    .leftJoin(items, eq(orderItems.itemId, items.id))
    .leftJoin(users, eq(orders.userId, users.id))
    .leftJoin(tables, eq(orders.tableId, tables.id));
  // const data = await api.order.getAll("Pending");
  console.log("Must be server compoonenntS:: >>> >> .> .> >>>>> ..>> ", data);
  return (
    <main className="md:p-2">
      <Card className="p-5">
        <h1 className="text-4xl font-bold">Kitchen</h1>
        <p className="mt-2 text-gray-400">This is the kitchen page.</p>
        {/* {isLoading && <Loading />}
        {isError && <Error message="Fail to fetch Penging orders" />} */}
        {/* {data && (
          <DataTable data={data} columns={columns} searchField="orderId" />
        )} */}
        {!data?.length ? (
          <p className="my-10 text-center text-gray-400">
            No orders to display
          </p>
        ) : (
          // <KitchenOrderDisplay data={data} />
          <pre>{JSON.stringify(data, undefined, 2)}</pre>
        )}
      </Card>
    </main>
  );
}
