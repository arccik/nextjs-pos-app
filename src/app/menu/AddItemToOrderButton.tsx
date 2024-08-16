"use client";
import { Button } from "@/components/ui/button";

import { type Item } from "@/server/db/schemas/item";
import { api } from "@/trpc/react";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import QuantityButtons from "./QuantityButtons";
import useOrder from "@/hooks/useOrder";
import useLocalStorage from "@/hooks/useLocalStorage";

type AddItemToOrderButtonProps = {
  item: Item;
};

export default function AddItemToOrderButton({
  item,
}: AddItemToOrderButtonProps) {
  const utils = api.useUtils();

  const [quantity, setQuantity] = useState(1);
  const { add } = useOrder();
  const [orderId, _] = useLocalStorage<string | undefined>(
    "orderId",
    undefined,
  );

  console.log("Use Local Storage Data", orderId);

  const handleAddItem = ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    const res = add({ itemId, quantity, id: orderId ?? undefined });
    utils.order.invalidate();
    console.log("add item to the order", { itemId, quantity, orderId, res });
  };

  return (
    <div className="flex items-center gap-2">
      <QuantityButtons onChange={(e) => setQuantity(e)} value={quantity} />
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAddItem({ itemId: item.id, quantity })}
        disabled={!item.isAvailable}
      >
        <PlusIcon size="1rem" className="mr-1" /> Add to Order
      </Button>
    </div>
  );
}
