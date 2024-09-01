"use client";

import { Button } from "@/components/ui/button";
import { type OrderStatus } from "@/server/db/schemas";
import PaymentButton from "./payment/PaymentButton";
import useOrder from "@/hooks/useOrder";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";

type ActionButtonsProps = {
  orderId: string;
  status: OrderStatus[number];
  isPaid?: boolean | null;
  guestLeft?: boolean;
};

export default function ActionButtons({
  orderId,
  status,
  isPaid,
  guestLeft,
}: ActionButtonsProps) {
  const { changeStatus, setSelectedOrder } = useOrder();
  const utils = api.useUtils();
  const guestLeave = api.table.guestLeave.useMutation({
    onSuccess: async () => {
      toast({
        title: "Guest left",
        description: "Guest has left the table",
      });
      await utils.order.invalidate();
    },
  });
  const router = useRouter();
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
    router.refresh();
  };

  const handleAddMoreItems = () => {
    setSelectedOrder(orderId);
    router.push("/menu");
  };

  const handleGuestLeave = () => {
    guestLeave.mutate({ orderId });
  };
  return (
    <>
      {!isPaid && (
        <Button
          onClick={handleAddMoreItems}
          className="w-full"
          variant="outline"
        >
          <PlusIcon className="mr-2 h-4 w-4" /> Add More
        </Button>
      )}
      <div className="flex w-full gap-2">
        {!["In Progress", "Completed"].includes(status) && (
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

        {!guestLeft && isPaid && status === "Completed" && (
          <Button onClick={handleGuestLeave} className="w-full">
            Guest Left
          </Button>
        )}

        {!isPaid && <PaymentButton orderId={orderId} />}
      </div>
    </>
  );
}
