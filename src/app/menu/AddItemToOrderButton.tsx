"use client";
import { Button } from "@/components/ui/button";

import { type Item } from "@/server/db/schemas/item";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import QuantityButtons from "./QuantityButtons";
import useOrder from "@/hooks/useOrder";

type AddItemToOrderButtonProps = {
  item: Item;
  orderId?: string;
};

export default function AddItemToOrderButton({
  item,
  orderId,
}: AddItemToOrderButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { add } = useOrder();

  console.log("Use Local Storage Data", orderId);

  const handleAddItem = ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    add({ itemId, quantity, id: orderId });
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
