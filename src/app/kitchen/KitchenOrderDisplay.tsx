import { combinedOrders } from "@/lib/utils";
import { type OrderItemsWithOrderAndItems } from "@/server/db/schemas";
import { formatDistance } from "date-fns";
import { useMemo } from "react";
import KitchenOrderItems from "./KitchenOrderItems";
import { MainOrder } from "@/server/models/order";
// import MakeReadyButton from "./MakeReadyButton";

type KitchenOrderDisplayProps = {
  data: MainOrder[];
};

export default function KitchenOrderDisplay({
  data,
}: KitchenOrderDisplayProps) {
  // const ordersToDisplay = useMemo(() => combinedOrders(data), [data]);

  return (
    <div className="mt-10 flex flex-col gap-4">
      {data?.map((order) => (
        <div key={order.id} className="rounded-lg bg-white p-4 shadow-md">
          <div className="orders-center mb-2 flex justify-between">
            <span className="text-lg font-semibold">Order {order.id}</span>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              <p>
                <b>Waiter:</b> {order.user?.name}
              </p>
              <p>
                <b>Ordered at: </b>
                {/* {formatDistance(order.createdAt, new Date(), {
                  addSuffix: true,
                  includeSeconds: true,
                })} */}
              </p>
              <span className="text-sm text-gray-500">
                {order.table ? (
                  <p>
                    <b>Table</b> {order.table.number}
                  </p>
                ) : (
                  <p>Take Away</p>
                )}
              </span>
            </div>
            {/* <MakeReadyButton orderId={order.orderId} itemId={order.itemId} /> */}
          </div>

          <hr className="my-2" />
          <KitchenOrderItems items={order.orderItems} orderId={order?.id} />
        </div>
      ))}
    </div>
  );
}
