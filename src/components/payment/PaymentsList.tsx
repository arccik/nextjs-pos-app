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
import { formatCurrency } from "@/lib/utils";
import { api } from "@/trpc/react";

type PaymentsListProps = {
  tipsAmount?: number | null;
  billId: string;
};

export default function PaymentsList({
  tipsAmount,
  billId,
}: PaymentsListProps) {
  const { data: payments } = api.payment.getAll.useQuery({ billId });

  if (payments?.length === 0) return null;

  const summary = payments?.reduce((a, b) => a + b.chargedAmount, 0);
  return (
    <section>
      <h1> Payments</h1>
      <Table className="rounded-lg bg-slate-100 dark:border dark:bg-transparent">
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
              <TableCell className="font-medium">{payment.user.name}</TableCell>
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
              <TableCell colSpan={2} className="text-bold text-right text-xs">
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
        </TableFooter>
      </Table>
    </section>
  );
}
