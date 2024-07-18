"use client";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { type Item } from "@/server/db/schemas/item";
import { PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

type AddItemToOrderButtonProps = {
  item: Item;
};

export default function AddItemToOrderButton({
  item,
}: AddItemToOrderButtonProps) {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const orderId = params.get("orderId");
  // TODO: Try to use params.set('orderId', res.id) instead

  console.log("AddITem ButTOn : ", orderId);
  const addItem = api.order.addItems.useMutation({
    onSuccess: (res) => {
      console.log("Success. Response: ", res.id);
      // params.set("orderId", res.id);
      router.push(pathname + "?" + `orderId=${res.id}`);
      toast({
        title: "Order created",
      });
    },
  });

  const handleClick = () => {
    addItem.mutate({ orderId, itemId: item.id });
    console.log("Add items to order: Status take");

    toast({
      title: `${item.name} added to selected order`,
    });
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={!item.isAvailable}
    >
      <PlusIcon size="1rem" className="mr-1" /> Add to Order
    </Button>
  );
}
