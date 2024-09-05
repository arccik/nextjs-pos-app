import { api } from "@/trpc/react";

export default function useBill(orderId: string) {
  const { data: bill, refetch: refetchBill } =
    api.bill.getOneByOrderId.useQuery(orderId);
  const billId = bill?.id;
  const { data: payments } = api.payment.getAll.useQuery(
    { billId: billId ?? "" },
    { enabled: !!billId },
  );

  const tips = bill?.tipAmount ?? 0;

  const utils = api.useUtils();
  const makePayment = api.payment.create.useMutation({
    onSuccess: async () => {
      await utils.order.invalidate();
      await utils.payment.invalidate();
    },
  });
  const saveTips = api.bill.addTips.useMutation({
    onSuccess: () => refetchBill(),
  });

  const pay = (type: "Card" | "Cash", amount: number) => {
    if (!billId) return null;
    makePayment.mutate({
      billId,
      chargedAmount: amount,
      paymentMethod: type,
      orderId,
    });
  };

  const addTips = (amount: number) => {
    if (!billId) return null;
    saveTips.mutate({ billId, amount });
  };
  return { total: bill?.totalAmount, pay, addTips, billId, payments, tips };
}
