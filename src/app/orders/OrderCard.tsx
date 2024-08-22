import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { MainOrder, type OrderWithItems } from "@/server/models/order";

import DisplayOrderItems from "./DisplayOrderItems";
import CountDownOpenOrder from "./CountDownOpenOrder";
import { countTotal, formatCurrency, formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// import ActionButtons from "@/components/ActionButtons";
import { HandPlatter } from "lucide-react";
import TableIcon from "@/components/navbar/TableIcon";
import Link from "next/link";
import { useState } from "react";
import ActionButtons from "@/components/ActionButtons";

type OrderCardProps = {
  order: MainOrder;
};

export default function OrderCard({ order }: OrderCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const tableNumber = order.table?.number;
  const serviceFee = order.bill?.serviceFee;
  const total = order.bill?.totalAmount;

  return (
    <Card className="w-full">
      <CardHeader
        className="cursor-pointer pb-5"
        onClick={() => setShowDetails((prev) => !prev)}
      >
        <CardTitle className="flex justify-between">
          <Link href={`/order?id=${order.id}`}>
            <span>Order #{formatId(order.id)}</span>
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
        {order.specialRequest && (
          <CardDescription>{order.specialRequest}</CardDescription>
        )}
        <div className="flex items-center justify-between  gap-4">
          <div className="grid grid-flow-col gap-1 text-sm">
            {tableNumber ? (
              <div key="Table Number">
                <p className="flex items-center font-semibold">
                  <TableIcon className="mr-2 h-6 w-6" />
                  Table <strong>{tableNumber}</strong>
                </p>
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
          </div>
          <CountDownOpenOrder date={order.createdAt} />
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="grid gap-4">
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
        </CardContent>
      )}
      <CardFooter className="flex flex-col justify-center gap-4 p-4">
        <ActionButtons
          status={order.status}
          orderId={order.id}
          isPaid={order.isPaid}
          tableId={order.tableId}
          totalAmount={total}
        />
      </CardFooter>
    </Card>
  );
}
