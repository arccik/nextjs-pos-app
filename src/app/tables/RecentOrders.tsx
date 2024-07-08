import Link from "next/link";
import type { OrderWithUserAndBill } from "@/server/db/schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { recentCompletedOrders } from "@/server/db/models/order";

type RecentOrdersProps = {
  tableId: number;
};
export default async function RecentOrders({ tableId }: RecentOrdersProps) {
  const data = await recentCompletedOrders(tableId);
  if (!data || data.length === 0) {
    return (
      <p className="text-md text-center text-gray-500">
        No recent orders are available to display at this time.
      </p>
    );
  }
  if ("error" in data) {
    console.log("Recent ORder: ", data.error);
    return <p>Something went wrong... </p>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
        <CardDescription>
          Here are the most recent orders from your customers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Employee Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link
                    className="font-medium underline"
                    href={`/order?id=${order.id}`}
                  >
                    #{order.id}
                  </Link>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatCurrency(order.bill?.totalAmount)}</TableCell>
                <TableCell>{order.user.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
