"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";

import { type Item } from "@/server/db/schemas/item";
import { ChevronRight, ChevronLeft, PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import OrderContext, { OrderDataType } from "./provider";

export type ShortItem = {
  itemId: string;
  quantity: number;
  name: string;
  price: number;
};

export type OrderData = {
  table: { id: string; number: number } | null;
  items: ShortItem[];
  orderId: string | null;
};

type AddItemToOrderButtonProps = {
  item: Item;
};

export default function AddItemToOrderButton({
  item,
}: AddItemToOrderButtonProps) {
  const { orderData, setOrderData } = useContext(OrderContext);
  console.log("Add Item to the order button: ", orderData);

  const handleClick = (item: Item) => {
    if (!orderData || orderData?.items.length === 0) {
      setOrderData({
        table: null,
        orderId: null,
        items: [
          { itemId: item.id, name: item.name, price: item.price, quantity: 1 },
        ],
      });
    } else {
      const existingItemIndex = orderData.items.findIndex(
        (orderItem) => orderItem.itemId === item.id,
      );

      let updatedItems: ShortItem[];
      if (existingItemIndex !== -1) {
        updatedItems = [...orderData.items];
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems = [
          ...orderData.items,
          { itemId: item.id, name: item.name, price: item.price, quantity: 1 },
        ];
      }

      setOrderData({ ...orderData, items: updatedItems });
    }
  };

  return (
    <div className="m-4 flex items-end align-bottom">
      <div className="flex">
        <Button
          variant="outline"
          size="icon"
          disabled={
            !item.isAvailable ||
            orderData?.items.findIndex(
              (i) => i.itemId === item.id && i.quantity <= 1,
            ) === -1
          }
          onClick={() => {
            const existingItemIndex = orderData?.items.findIndex(
              (i) => i.itemId === item.id,
            );
            if (existingItemIndex !== -1) {
              const updatedItems = [...orderData.items];
              updatedItems[existingItemIndex].quantity = Math.max(
                updatedItems[existingItemIndex].quantity - 1,
                1,
              );
              setOrderData({ ...orderData, items: updatedItems });
            }
          }}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          type="number"
          value={1} // You can remove the value prop since it's not being used
          disabled
        />
        <Button
          variant="outline"
          size="icon"
          disabled={!item.isAvailable}
          onClick={() => handleClick(item)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleClick(item)}
        disabled={!item.isAvailable}
      >
        <PlusIcon size="1rem" className="mr-1" /> Add to Order
      </Button>
    </div>
  );
}
