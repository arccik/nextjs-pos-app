"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useState } from "react";

type Item = {
  name: string;
  quantity: number;
  id: string;
};

type KitchenOrderItemsProps = {
  items: Item[];
  orderId: string;
};
export default function KitchenOrderItems({ items }: KitchenOrderItemsProps) {
  const [checked, setChecked] = useState<string[]>([]);

  const handleChecked = (e: CheckedState, itemId: string) => {
    if (e) {
      setChecked((prev) => [...prev, itemId]);
    } else {
      setChecked((prev) => prev.filter((id) => id !== itemId));
    }
  };

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.name}
          className={cn(
            "flex items-center justify-between p-2",
            checked?.includes(item.id) && "rounded-md backdrop-brightness-95",
          )}
        >
          <span>{item.name}</span>
          <div className="flex items-center  gap-4 p-2">
            <span className="text-gray-500">x{item.quantity}</span>
            <Checkbox
              className="size-10 accent-emerald-50"
              onCheckedChange={(checked) => handleChecked(checked, item.id)}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
