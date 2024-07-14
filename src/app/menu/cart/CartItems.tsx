import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
  TableFooter,
} from "@/components/ui/table";
import type { Item } from "@/server/db/schemas/item";
import { useVenueSettings } from "@/hooks/useVenueSettings";
import { formatCurrency } from "@/lib/utils";

type CartItemsProps = {
  items: Item[];
};
export default function CartItems({ items }: CartItemsProps) {
  const { venueSettings } = useVenueSettings();
  const serviceFee = Number(venueSettings?.serviceFee || 0);
  const totalAmount =
    items.reduce<number>((total, item) => {
      return (total += Number(item.price));
    }, 0) + serviceFee;

  type ItemWithQuantity = Item & { quantity: number };
  const combinedItems = items.reduce((acc, item) => {
    const existing = acc.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      acc.push({ ...item, quantity: 1 });
    }
    return acc;
  }, [] as ItemWithQuantity[]);

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
        {combinedItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="font-medium">{item.quantity}</TableCell>
            <TableCell className="font-medium">{item.price}</TableCell>
            <TableCell className="text-right font-medium">
              {(item.quantity * Number(item.price))?.toFixed(2)}
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
        <TableRow>
          <TableCell colSpan={3}>Sub Total</TableCell>
          <TableCell className="text-right">
            {formatCurrency(totalAmount.toFixed(2))}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
