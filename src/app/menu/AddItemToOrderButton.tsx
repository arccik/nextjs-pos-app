"use client";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

import { type Item } from "@/server/db/schemas/item";
import { ChevronRight, ChevronLeft, PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import useLocalStorageOrderData from "@/hooks/useLocalStorageOrderData";

type AddItemToOrderButtonProps = {
  item: Item;
};

export default function AddItemToOrderButton({
  item,
}: AddItemToOrderButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [localOrder, setLocalOrder] = useLocalStorageOrderData();

  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const orderId = params.get("orderId");
  // TODO: Try to use params.set('orderId', res.id) instead

  console.log("AddITem ButTOn : ", orderId);
  const addItem = api.order.addItems.useMutation({
    onSuccess: (res) => {
      console.log("Success. Response: ", res);
      // res && params.set("orderId", res?.id);
      if (!orderId) router.push(pathname + "?" + `orderId=${res?.id}`);
      // toast({
      //   title: "Order created",
      // });
    },
  });
  const createOrder = api.order.create.useMutation({
    onSuccess: () => console.log("Order Created!"),
  });

  const handleClick = () => {
    setLocalOrder({
      ...localOrder,
      items: [
        ...localOrder.items,
        { itemId: item.id, quantity, name: item.name, price: item.price },
      ],
    });
    // if (orderId) {
    //   addItem.mutate({ orderId, itemId: item.id, quantity });
    // } else {
    //   createOrder.mutate({ items: [{ itemId: item.id, quantity }] });
    // }
    // console.log("Add items to order: Status take");

    // toast({
    //   title: `${item.name} added to selected order`,
    // });
  };
  return (
    <div className="m-4 flex items-end align-bottom">
      <div className="flex">
        <Button
          variant="outline"
          size="icon"
          disabled={quantity <= 1}
          onClick={() => setQuantity((prev) => prev - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          type="number"
          value={quantity}
          disabled
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Button
          variant="outline"
          size="icon"
          disabled={quantity > 90}
          onClick={() => setQuantity((prev) => prev + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={!item.isAvailable}
      >
        <PlusIcon size="1rem" className="mr-1" /> Add to Order
      </Button>
    </div>
  );
}
