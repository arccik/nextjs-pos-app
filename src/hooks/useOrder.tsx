"use client";
import { Order } from "@/server/db/schemas";
import { api } from "@/trpc/react";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  orderId?: string;
};

export default function useOrder(orderId?: string) {
  const creteOrder = api.order.newOrder.useMutation();
  const addItemToOrder = api.order.addMoreItemsToOrder.useMutation();
  const deleteOrder = api.order.deleteOne.useMutation();
  const removeItemFromOrder = api.order.removeItemFromOrder.useMutation();
  const updateOrder = api.order.updateOrder.useMutation();

  const add = ({ itemId, quantity, orderId }: AddToOrderProps) => {
    if (orderId) {
      return addItemToOrder.mutate([{ itemId, quantity, orderId }]);
    }
    creteOrder.mutate();
    if (creteOrder.data) {
      return addItemToOrder.mutate([
        { itemId, quantity, orderId: creteOrder.data.id },
      ]);
    }
  };

  const deleteOne = (id: string) => {
    deleteOrder.mutate({ id });
  };

  const removItem = ({
    itemId,
    orderId,
  }: {
    itemId: string;
    orderId: string;
  }) => {
    console.log("remove item from the order");
    removeItemFromOrder.mutate({ itemId, orderId });
  };

  const update = ({ id, body }: { id: string; body: Order }) => {
    console.log("update item in the order", { id, body });
    updateOrder.mutate({ id, body });
  };

  const isLoading = creteOrder.isPending || addItemToOrder.isPending;
  return {
    add,
    update,
    delete: deleteOne,
    removItem,
    isLoading,
  };
}
