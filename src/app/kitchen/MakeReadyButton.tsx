// import { makeReady } from "@/api/orders";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

type MakeReadyButtonProps = {
  orderId: number;
  itemId: number;
};

export default function MakeReadyButton({
  orderId,
  itemId,
}: MakeReadyButtonProps) {
  //   const queryClient = useQueryClient();
  //   const ready = useMutation({
  //     mutationFn: () => makeReady(orderId, itemId),
  //     mutationKey: ["orders"],
  //     onSuccess: (data) => {
  //       toast({
  //         title: "Order ready",
  //         description: data.message,
  //       });
  //       queryClient.invalidateQueries({ queryKey: ["orders"] });
  //     },
  //     onError: (error) =>
  //       toast({
  //         title: "Error",
  //         description: error.message,
  //       }),
  //   });
  //   const handleClick = () => {
  //     ready.mutate();
  //   };
  return (
    <Button
    //    onClick={handleClick}
    >
      Order Ready
    </Button>
  );
}
