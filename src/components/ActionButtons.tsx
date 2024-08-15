// import { useMutation, useQueryClient } from "@tanstack/react-query";

// import AddItem from "./AddItem";
import { Button } from "@/components/ui/button";
// import { complete, serve, leave } from "@/api/orders";
// import { useToast } from "@/components/ui/use-toast";
import { type OrderStatus } from "@/server/db/schemas";
import PaymentButton from "./payment/PaymentButton";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";
// import PaymentButton from "./Payment/PaymentButton";

type ActionButtonsProps = {
  orderId: string;
  status: OrderStatus[number];
  isPaid?: boolean | null;
  tableId?: string | null;
  totalAmount: number;
};

export default function ActionButtons({
  orderId,
  status,
  isPaid,
  tableId,
  totalAmount,
}: ActionButtonsProps) {
  // const queryClient = useQueryClient();
  // const { toast } = useToast();

  const buttonText: Record<OrderStatus[number], string> = {
    Pending: "In Progress",
    "In Progress": "Order is preparing",
    Ready: "Order served",
    Served: "Guest leave",
    Completed: "Completed",
    Cancelled: "Order Cancelled",
  };
  const setOrderStatus = api.order.setStatus.useMutation({
    onSuccess: () =>
      toast({
        title: "Order Status",
        description: "The order has been served",
      }),
    onError: (error) => {
      console.error("Server Order: ", { error });
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // const serveOrder = useMutation({
  //   mutationFn: () => serve(orderId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({
  //       queryKey: ["order", orderId.toString()],
  //     });
  //     queryClient.invalidateQueries({ queryKey: ["table", tableId] });
  //     queryClient.invalidateQueries({ queryKey: ["tables"] });
  //     queryClient.invalidateQueries({ queryKey: ["orders"] });

  //     toast({
  //       title: "Order served",
  //       description: "The order has been served",
  //     });
  //   },
  //   onError: (error) => {
  //     console.error("Server Order: ", { error });
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong",
  //       variant: "destructive",
  //     });
  //   },
  // });

  // const completeOrder = useMutation({
  //   mutationFn: () => complete(orderId),
  //   onSuccess: () => {
  //     toast({ title: "Order Completed Successfully!" });
  //     queryClient.invalidateQueries();
  //   },
  //   onError: (error) => {
  //     toast({ title: "Fail to complete order, network error" });
  //     console.error("Server Order: ", { error });
  //   },
  // });
  // const guestLeave = useMutation({
  //   mutationFn: () => leave(orderId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries();
  //     // queryClient.invalidateQueries({ queryKey: ["tables"] });
  //     // queryClient.invalidateQueries({ queryKey: ["orders"] });
  //     // queryClient.invalidateQueries({ queryKey: ["order", orderId.toString()] });
  //     toast({ title: "Table Mark As 'Cleaning required'" });
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     toast({ title: "Fail to mark table as cleaning" });
  //   },
  // });

  // const handleOrderServed = () => {
  //   if (!orderId) return;
  //   if (status === "In Progress")
  //     return toast({
  //       title: "The order is currently in progress in our kitchen.",
  //       variant: "destructive",
  //     });
  //   if (status === "Ready") {
  //     serveOrder.mutate(); // kitchen set status READY
  //   }
  //   if (status === "Served" && isPaid) {
  //     completeOrder.mutate();
  //     guestLeave.mutate();
  //   }
  //   if (status === "Served" && !isPaid) {
  //     toast({
  //       title: "Order cannot be close due to the outstanding payment",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const handleClick = () => {
    setOrderStatus.mutate({ orderId, status });
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
