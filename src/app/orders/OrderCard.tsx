"use client";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

import { type MainOrder } from "@/server/models/order";

import DisplayOrderItems from "./DisplayOrderItems";
import CountDownOpenOrder from "./CountDownOpenOrder";
import { formatCurrency, formatId } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

import { HandPlatter } from "lucide-react";
import TableIcon from "@/components/navbar/TableIcon";
import Link from "next/link";
import ActionButtons from "@/components/ActionButtons";
import PaymentsList from "@/components/payment/PaymentsList";
import Loading from "@/components/Loading";

type OrderCardProps = {
  order: MainOrder;
};

export default function OrderCard({ order }: OrderCardProps) {
  const tableNumber = order.table?.number;
  const serviceFee = order.bill?.serviceFee;
  const tipAmount = order.bill?.tipAmount;

  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader className="pb-5">
        <CardTitle className="flex justify-between">
          <div className="flex tracking-tighter">
            <Link href={`/orders/${order.id}`}>
              <span>Order #{formatId(order.id)}</span>
            </Link>
          </div>
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
        </div>
      </CardHeader>

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
        {/* {tipAmount && <p className="text-right text-sm">Tips: {tipAmount}</p>} */}
        {order.bill?.id && (
          <PaymentsList
            billId={order.bill?.id}
            tipsAmount={tipAmount}
            total={order.bill.totalAmount}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-4 p-4">
        <ActionButtons
          status={order.status}
          orderId={order.id}
          isPaid={order.isPaid}
          guestLeft={order.guestLeft}
        />
      </CardFooter>
      <div className="m-4 flex justify-between ">
        <span className="text-[0.6rem] text-slate-400">
          Serving By {order.creator.name}
        </span>
        <CountDownOpenOrder date={order.createdAt} />
      </div>
    </Card>
  );
}
