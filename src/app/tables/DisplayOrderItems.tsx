import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  TableFooter,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { type Bill } from "@/server/db/schemas";
import type { OrderWithItems } from "@/server/models/order";

export type Item = {
  itemId: number;
  quantity: number;
  items: {
    name: string | null;
    price: number | null;
    imageUrl: string | null;
  };
};

type DisplayOrderItemsProps = {
  items: Item[];
  bill?: Bill | null;
};

export default function DisplayOrderItems({
  items,
  bill,
}: DisplayOrderItemsProps) {
  const subTotal = items?.reduce((acc, item) => {
    return acc + Number(item.items.price) * item.quantity;
  }, 0);

  return (
    <Table className="mb-5">
      <TableHeader>
        <TableRow className="w-full">
          <TableHead className="max-w-[150px]">Name</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead colSpan={2} className="text-right">
            Total
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items?.map((item) => (
          <TableRow key={item.itemId}>
            <TableCell className="font-medium">{item.items.name}</TableCell>
            <TableCell className="text-center">{item.quantity}</TableCell>
            {item.items?.price && (
              <TableCell colSpan={2} className="text-right">
                {formatCurrency(
                  (Number(item.items.price) * item.quantity).toFixed(2),
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>

      <TableFooter>
        {!!subTotal && (
          <TableRow>
            <TableCell colSpan={3}>Sub Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(subTotal.toFixed(2))}
            </TableCell>
          </TableRow>
        )}
        {bill && bill.paid && (
          <TableRow className="bg-gray-200">
            <TableCell colSpan={3} className="font-bold">
              Paid
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(bill.totalAmount)}
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
}
