"use client";
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
import { Item, OrderItem } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { useMemo } from "react";

type CartItemsProps = {
  items: {
    itemId: string;
    quantity: number;
    items: {
      name: string;
      price: number;
      imageUrl: string | null;
    };
  }[];
};
export default function CartItems({ items }: CartItemsProps) {
  const { data: settings } = api.settings.get.useQuery();

  const serviceFee = settings?.serviceFee;
  const total = useMemo(
    () =>
      items.reduce<number>((total, item) => {
        return (total += Number(item.items.price) * item.quantity);
      }, 0),
    [items],
  );

  return (
    <Table className="mb-5">
      <TableHeader>
        <TableRow className="w-full">
          <TableHead className="max-w-[150px]">Name</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead colSpan={2} className="text-right">
            Total
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="mt-5">
        {items.map((item) => (
          <TableRow key={item.itemId}>
            <TableCell className="font-medium">{item.items.name}</TableCell>
            <TableCell className="font-medium">{item.quantity}</TableCell>
            <TableCell className="font-medium">{item.items.price}</TableCell>
            <TableCell className="text-right font-medium">
              {(item.quantity * Number(item.items.price))?.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {!!serviceFee && (
          <TableRow className="bg-white text-gray-400">
            <TableCell colSpan={3}>Service Fee</TableCell>
            <TableCell className="text-right">
              {formatCurrency(serviceFee)}
            </TableCell>
          </TableRow>
        )}
        {!!total && (
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {formatCurrency(total.toFixed(2))}
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
}
