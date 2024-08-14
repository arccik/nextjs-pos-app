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
  const [quantity, setQuantity] = useState(1);
  const { add } = useOrder();
  const [orderId] = useLocalStorage<string | null>("orderId", null);

  console.log("AddItemToOrderButtonPropsAddItemToOrderButtonProps", orderId);

  const handleAddItem = ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    const res = add({ itemId, quantity, id: orderId ?? undefined });
    console.log("add item to the order", { itemId, quantity, orderId });
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

