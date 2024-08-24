import { api } from "@/trpc/react";

export default function useAnalytic({ orderId }: { orderId: string }) {
  const { data: bill } = api.bill.getOneByOrderId.useQuery(orderId);
  const billId = bill?.id;
  if (!billId) return null;
  const { data: payments } = api.payment.getAll.useQuery(
    { billId },
    { enabled: !!billId },
  );
  const { data: mostPopular } = api.cookedItem.getMostPopular.useQuery();
  return (
    <div>
      <h1>useAnalytic</h1>
      <pre>{JSON.stringify({ bill, payments, mostPopular }, null, 2)}</pre>
    </div>
  );
}
