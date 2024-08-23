import { api } from "@/trpc/react";

export default function useBill(orderId: string) {
  const { data: bill, refetch: refetchBill } =
    api.bill.getOneByOrderId.useQuery(orderId);
  const makePayment = api.bill.payBill.useMutation({
    onSuccess: () => refetchBill(),
  });
  const pay = (billId: string, type: "Card" | "Cash", amount: number) => {
    makePayment.mutate({ billId, chargedAmount: amount, paymentMethod: type });
  };
  return { total: bill?.totalAmount, pay };
}
