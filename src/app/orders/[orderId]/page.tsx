"use client";
import { api } from "@/trpc/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OrderCard from "../OrderCard";
import Link from "next/link";
import Loading from "@/components/Loading";
import OrderNotFound from "./OrderNotFound";

export default function OrderPage({ params }: { params: { orderId: string } }) {
  const { data: order, isLoading } = api.order.getOne.useQuery({
    id: params.orderId,
  });

  return (
    <div className="container mx-auto max-w-[700px] p-0 md:p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        {order ? (
          <>
            <OrderCard order={order} />
            <div className="mt-5 flex justify-end space-x-2">
              <Link href="/orders">
                <Button variant="outline">Back to Orders</Button>
              </Link>
              <Button variant="default">Print Order</Button>
            </div>
          </>
        ) : isLoading ? (
          <Loading />
        ) : (
          <OrderNotFound />
        )}
      </CardContent>
    </div>
  );
}
