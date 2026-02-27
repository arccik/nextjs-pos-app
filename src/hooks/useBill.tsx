import { api } from "@/trpc/react";
import { useOnlineStatus } from "@/lib/onlineStatus";
import { db } from "@/lib/db/localDb";
import { enqueue } from "@/lib/syncQueue";
import { toast } from "@/components/ui/use-toast";

export default function useBill(orderId: string) {
  const { data: bill, refetch: refetchBill } =
    api.bill.getOneByOrderId.useQuery(orderId);
  const billId = bill?.id;
  const { data: payments } = api.payment.getAll.useQuery(
    { billId: billId! },
    { enabled: !!billId },
  );

  const total = bill?.totalAmount;
  const tips = bill?.tipAmount ?? 0;

  const utils = api.useUtils();
  const isOnline = useOnlineStatus();

  const makePayment = api.payment.create.useMutation({
    onSuccess: async () => {
      await utils.order.invalidate();
      await utils.payment.invalidate();
    },
  });
  const saveTips = api.bill.addTips.useMutation({
    onSuccess: () => refetchBill(),
  });

  const loading = makePayment.isPending;

  const pay = (type: "Card" | "Cash", amount: number) => {
    if (!billId) return null;

    if (!isOnline) {
      const idempotencyKey = crypto.randomUUID();
      void (async () => {
        await db.payments.add({
          id: idempotencyKey,
          billId,
          paymentMethod: type,
          chargedAmount: amount,
          tipAmount: null,
          userId: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          orderId,
          idempotencyKey,
        });
        await enqueue("payment.create", {
          billId,
          chargedAmount: amount,
          paymentMethod: type,
          orderId,
          idempotencyKey,
        });
        toast({ title: "Payment saved offline — will sync on reconnect" });
        await utils.payment.invalidate();
      })();
      return;
    }

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

  return {
    total,
    pay,
    addTips,
    billId,
    payments,
    tips,
    loading,
  };
}
