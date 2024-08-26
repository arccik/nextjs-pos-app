import { api } from "@/trpc/server";
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

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await api.order.getOne({ id: params.orderId });

  if (!order)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md p-4 text-center">
          <CardHeader>
            <CardTitle>Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>We couldn&apos;t find the order you&apos;re looking for.</p>
          </CardContent>
          <CardFooter>
            <Button variant="outline">Back to Orders</Button>
          </CardFooter>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto p-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderCard order={order} isOpen />
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Link href="/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
        <Button variant="default">Print Order</Button>
      </CardFooter>
    </div>
  );
}
