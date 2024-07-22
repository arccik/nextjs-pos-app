import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { type OrderWithItems } from "@/server/models/order";

import DisplayOrderItems from "./DisplayOrderItems";
import CountDownOpenOrder from "./CountDownOpenOrder";
import { formatCurrency, summarizePrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// import ActionButtons from "@/components/ActionButtons";
import { HandPlatter } from "lucide-react";
import TableIcon from "@/components/navbar/TableIcon";
// import { useVenueSettings } from "@/hooks/useVenueSettings";
import Link from "next/link";

type PendingOrderProps = {
  order: OrderWithItems;
};

export function PendingOrder({ order }: PendingOrderProps) {
  //   const { venueSettings, venueTables } = useVenueSettings();
  //   const serviceFee = Number(venueSettings?.serviceFee);
  //   const total = summarizePrice(order.orderItems) ?? 0 + serviceFee;
  //   const tableNumber = venueTables?.find(
  //     (table) => table.id === order.tableId,
  //   )?.number;
  const tableNumber = 11;
  const serviceFee = 22;
  const total = 55 + serviceFee;
  return (
    <Card className="w-full">
      <CardHeader className="pb-5">
        <CardTitle className="flex justify-between">
          <Link href={`/order?id=${order.id}`}>
            <span>Order #{order.id}</span>
          </Link>
          <span className="flex gap-2">
            <Badge>{order.status}</Badge>
            {order.isPaid && (
              <Badge
                variant="secondary"
                className="border-green-500 bg-green-300/20"
              >
                Paid
              </Badge>
            )}
          </span>
        </CardTitle>
        <CardDescription>
          Ready for pickup. Please deliver to the customer in 5 minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between  gap-4">
          <div className="grid grid-flow-col gap-1 text-sm">
            {tableNumber ? (
              <div key="Table Number">
                <p className="flex items-center font-semibold">
                  <TableIcon className="mr-2 h-6 w-6" />
                  Table # {tableNumber}
                </p>
                {order.specialRequest && (
                  <p key="special Request" className="text-sm text-gray-500">
                    Special Request: {order.specialRequest}
                  </p>
                )}
              </div>
            ) : (
              <p
                key="table not selected"
                className="flex  text-sm font-semibold"
              >
                <HandPlatter className="mr-2 h-6 w-6" />
                Take Away
              </p>
            )}
            {!!order?.specialRequest && (
              <p
                key="special request table"
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Special requests: {order.specialRequest}
              </p>
            )}
          </div>
          <CountDownOpenOrder date={order.createdAt} />
        </div>
        <div className="grid gap-2">
          <div className="grid items-center">
            <div className="font-medium">
              <DisplayOrderItems items={order.orderItems} bill={order.bill} />
            </div>
          </div>
        </div>
        {!!serviceFee && (
          <div className="grid grid-cols-2 items-center gap-2 text-sm text-slate-900">
            <div className="">Service fee</div>
            <div className="text-right">{formatCurrency(serviceFee)}</div>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>Total</div>
          <div>{formatCurrency(total.toFixed(2))}</div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-4 p-4">
        {/* <ActionButtons
          status={order.status}
          orderId={order.id}
          isPaid={order.isPaid}
          tableId={order.tableId}
          totalAmount={total}
        /> */}
      </CardFooter>
    </Card>
  );
}
