import { toast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";

type UseOrderStatusProps = {
  orderId: string;
};

export default function useOrderStatus({ orderId }: UseOrderStatusProps) {
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

  const status = "Is Pending";

  const setStatus = (status: OrderStatus[number]) => {
    setOrderStatus.mutate({ orderId, status });
  };

  return {
    setStatus,
    status,
  };
}
