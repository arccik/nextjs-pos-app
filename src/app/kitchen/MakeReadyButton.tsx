// import { makeReady } from "@/api/orders";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
// import { toast } from "@/components/ui/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";

type MakeReadyButtonProps = {
  orderId: string;
};

export default function MakeReadyButton({ orderId }: MakeReadyButtonProps) {
  const cookedItem = api.cookedItem.create.useMutation({
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return (
    <Button
    //    onClick={handleClick}
    >
      Order Ready
    </Button>
  );
}
