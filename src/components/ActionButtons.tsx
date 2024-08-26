"use client";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import AddItem from "./AddItem";
import { Button } from "@/components/ui/button";
// import { complete, serve, leave } from "@/api/orders";
// import { useToast } from "@/components/ui/use-toast";
import { type OrderStatus } from "@/server/db/schemas";
import PaymentButton from "./payment/PaymentButton";
import useOrder from "@/hooks/useOrder";
import { cn } from "@/lib/utils";

type ActionButtonsProps = {
  orderId: string;
  status: OrderStatus[number];
  isPaid?: boolean | null;
};

export default function ActionButtons({
  orderId,
  status,
  isPaid,
}: ActionButtonsProps) {
  const { changeStatus } = useOrder();
  const buttonText = {
    Pending: "In Progress",
    "In Progress": "Ready",
    Ready: "Served",
    Served: "Completed",
    Completed: "Cancelled",
    Cancelled: "Cancelled",
  } as const;
  const nextStatus: OrderStatus[number] = buttonText[status];

  const handleClick = () => {
    changeStatus({
      orderId,
      status: nextStatus,
    });
  };
  return (
    <>
      {/* {!isPaid && <AddItem fullWidth orderId={orderId} tableId={tableId} />} */}

      {status !== "In Progress" && (
        <Button
          className={cn(
            "w-full border hover:border-slate-500 hover:bg-transparent",
            nextStatus === "Cancelled" &&
              "border border-red-500/40 bg-transparent hover:border-red-400",
          )}
          variant="secondary"
          onClick={handleClick}
          disabled={!!isPaid && status === "Completed"}
        >
          {nextStatus}
        </Button>
      )}

      {!isPaid && <PaymentButton orderId={orderId} />}
    </>
  );
}
