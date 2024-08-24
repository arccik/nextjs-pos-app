import { api } from "@/trpc/server";
import OrderCard from "../OrderCard";

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await api.order.getOne({ id: params.orderId });
  if (!order) return <p>Order Not found</p>;
  console.log("OrderPage", order);
  return <OrderCard order={order} />;
}
