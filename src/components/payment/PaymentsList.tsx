"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Payment } from "@/server/db/schemas";
import { formatCurrency } from "@/lib/utils";

type PaymentsListProps = {
  payments?: Payment[];
  tipsAmount?: number | null;
  total?: number;
};

export default function PaymentsList({
  payments,
  total,
  tipsAmount,
}: PaymentsListProps) {
  const totalPaid = payments?.reduce(
    (acc, payment) => acc + Number(payment.chargedAmount),
    0,
  );
  const summary = total ?? 0 + (tipsAmount ? Number(tipsAmount) : 0);
  return (
    <Table>
      <TableHeader>
        {!!payments?.length && (
          <TableRow>
            <TableHead>UserId</TableHead>
            <TableHead className="text-center">Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        )}
      </TableHeader>
      <TableBody>
        {payments?.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.userId}</TableCell>
            <TableCell className="text-center">
              {payment.paymentMethod}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(payment.chargedAmount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {!!tipsAmount && (
          <TableRow>
            <TableCell colSpan={2} className="text-bold text-xs">
              Tips
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(tipsAmount)}
            </TableCell>
          </TableRow>
        )}
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell className="text-right">
            {formatCurrency(summary)}
          </TableCell>
        </TableRow>

        {!!totalPaid && (
          <TableRow className="bg-slate-200">
            <TableCell colSpan={2}>Paid</TableCell>
            <TableCell className="text-right">
              {formatCurrency(totalPaid)}
            </TableCell>
          </TableRow>
        )}
      </TableFooter>
    </Table>
  );
}
