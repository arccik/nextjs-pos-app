import DisplayOrderItems from "../orders/DisplayOrderItems";
import type { OrderWithItems } from "@/server/models/order";

type TableDetailsProps = {
  data: OrderWithItems;
};

export default function TableDetails({ data }: TableDetailsProps) {
  return <DisplayOrderItems items={data.orderItems} />;
}
