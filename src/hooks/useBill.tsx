import { api } from "@/trpc/react";

export default function useBill(orderId: string) {
  const { data: bill, refetch: refetchBill } =
    api.bill.getOneByOrderId.useQuery(orderId);
  const utils = api.useUtils();
  const makePayment = api.payment.create.useMutation({
    onSuccess: async () => {
      await utils.order.invalidate();
      await refetchBill();
    },
  });
  const saveTips = api.bill.addTips.useMutation({
    onSuccess: () => refetchBill(),
  });

  const pay = (type: "Card" | "Cash", amount: number) => {
    if (!bill?.id) return null;
    makePayment.mutate({
      billId: bill.id,
      chargedAmount: amount,
      paymentMethod: type,
      orderId,
    });
  };

  const addTips = (amount: number) => {
    if (!bill?.id) return null;
    saveTips.mutate({ billId: bill.id, amount });
  };
  return { total: bill?.totalAmount, pay, addTips, billId: bill?.id };
}
