"use client";
import { Checkbox } from "@/components/ui/checkbox";
import useCookedItem from "@/hooks/useCookedItem";
import { cn } from "@/lib/utils";
import { OrderItem } from "@/server/db/schemas";
import { OrderWithItems } from "@/server/models/order";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

type Item = {
  name: string;
  quantity: number;
  id: string;
};

type KitchenOrderItemsProps = {
  items: OrderWithItems["orderItems"];
  orderId: string;
};
export default function KitchenOrderItems({
  items,
  orderId,
}: KitchenOrderItemsProps) {
  // const [checked, setChecked] = useState<string[]>([]);
  const { add, remove, cookedItems } = useCookedItem(orderId);
  console.log("cookedItems", cookedItems);

  const isChecked = (itemId: string) => cookedItems?.includes(itemId);

  const handleChecked = (e: CheckedState, itemId: string) => {
    if (e) {
      add(itemId);
      // setChecked((prev) => [...prev, itemId]);
    } else {
      // setChecked((prev) => prev.filter((id) => id !== itemId));
      remove(itemId);
    }
  };

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.itemId}
          className={cn(
            "flex items-center justify-between p-2",
            isChecked(item.itemId) && "rounded-md backdrop-brightness-95",
          )}
        >
          <span>{item.items.name}</span>
          <div className="flex items-center  gap-4 p-2">
            <span className="text-gray-500">x{item.quantity}</span>
            <Checkbox
              className="size-10 accent-emerald-50"
              onCheckedChange={(checked) => handleChecked(checked, item.itemId)}
              checked={isChecked(item.itemId)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
