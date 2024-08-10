"use client";
import { Button } from "@/components/ui/button";

import { type Item } from "@/server/db/schemas/item";
import { ChevronRight, ChevronLeft, PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

type AddItemToOrderButtonProps = {
  item: Item;
};

export default function AddItemToOrderButton({
  item,
}: AddItemToOrderButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = api.order.create.useMutation({
    onSuccess: () => console.log("item successfully added!"),
    onError: () => console.log("Something went wrong!"),
  });

  const handleAddItem = ({
    itemId,
    quantity,
  }: {
    itemId: string;
    quantity: number;
  }) => {
    console.log("add item to the order", { itemId, quantity });
  };

  return (
    <div className="m-4 flex items-end align-bottom">
      <QuantityButtons onChange={(e) => setQuantity(e)} />
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

function QuantityButtons({ onChange }: { onChange: (q: number) => void }) {
  const [quantity, setQuantity] = useState(1);

  const handleClick = (operator: "+" | "-") => {
    if (operator === "+") {
      setQuantity(quantity + 1);
    } else if (operator === "-" && quantity > 1) {
      setQuantity(quantity - 1);
    }
    onChange(quantity);
  };
  return (
    <div className="flex">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleClick("-")}
        disabled={quantity === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Input
        className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        value={quantity} // You can remove the value prop since it's not being used
        disabled
      />
      <Button variant="outline" size="icon" onClick={() => handleClick("+")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
