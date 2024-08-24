import { formatId } from "@/lib/utils";
import { format } from "date-fns";
import KitchenOrderItems from "./KitchenOrderItems";
import { type MainOrder } from "@/server/models/order";
import MakeReadyButton from "./MakeReadyButton";
import { Card } from "@/components/ui/card";

type KitchenOrderDisplayProps = {
  data: MainOrder[];
};

export default function KitchenOrderDisplay({
  data,
}: KitchenOrderDisplayProps) {
  return (
    <div className="mt-10 flex flex-col gap-4">
      {data?.map((order) => (
        <Card key={order.id} className="bg-primary-foreground/45 p-4 shadow-md">
          <div className="orders-center mb-2 flex justify-between">
            <span className="text-lg font-semibold">
              Order {formatId(order.id)}
            </span>
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              <p>
                <b>Waiter:</b> {order.creator?.name}
              </p>
              <p>
                <b>Ordered at: </b>
                {format(order.createdAt, "dd-MM-yyyy / HH:mm")}
              </p>
              <span className="text-sm text-gray-500">
                {order.table ? (
                  <p>
                    <b>Table</b> {order.table.number}
                  </p>
                ) : (
                  <p className="text-red-500">Take Away</p>
                )}
              </span>
            </div>
            <MakeReadyButton orderId={order.id} />
          </div>

          <hr className="my-2" />
          <KitchenOrderItems items={order.orderItems} orderId={order?.id} />
        </Card>
      ))}
    </div>
  );
}
