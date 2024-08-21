// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import AddItem from "./AddItem";
import { Button } from "@/components/ui/button";
// import { complete, serve, leave } from "@/api/orders";
// import { useToast } from "@/components/ui/use-toast";
import { type OrderStatus } from "@/server/db/schemas";
import PaymentButton from "./payment/PaymentButton";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
import useOrder from "@/hooks/useOrder";
// import PaymentButton from "./Payment/PaymentButton";

type ActionButtonsProps = {
  orderId: string;
  status: OrderStatus[number];
  isPaid?: boolean | null;
  tableId?: string | null;
  totalAmount?: number;
};

export default function ActionButtons({
  orderId,
  status,
  isPaid,
  tableId,
  totalAmount,
}: ActionButtonsProps) {
  const { changeStatus } = useOrder();
  const buttonText: Record<OrderStatus[number], string> = {
    Pending: "In Progress",
    "In Progress": "Ready",
    Ready: "Served",
    Served: "Completed",
    Completed: "Cancelled",
    Cancelled: "Cancelled",
  };

  const handleClick = () => {
    changeStatus({
      orderId,
      status: buttonText[status],
    });
  };
  return (
    <>
      {/* {!isPaid && <AddItem fullWidth orderId={orderId} tableId={tableId} />} */}

      {status !== "In Progress" && (
        <Button
          className="w-full"
          onClick={handleClick}
          disabled={!!isPaid && status === "Completed"}
        >
          {buttonText[status]}
        </Button>
      )}

      {/* {!isPaid && <PaymentButton orderId={orderId} totalAmount={totalAmount} />} */}
    </>
  );
}
