"use client";
import { Order } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { useUrlState } from "./useUrlState";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};

export default function useOrder(id?: string) {
  const [orderId, setOrderId] = useState<string | undefined>(id);
  const router = useRouter();
  const creteOrder = api.order.newOrder.useMutation({
    onSuccess: (data) => {
      // data && setOrderId(data.id);
      // router.push(`/${data?.id}`);
      console.log("CREATED ORDER: ", { data });

      router.replace(`?orderId=${data?.id}`);
      setOrderId(data?.id);
    },
  });
  const addItemToOrder = api.order.addMoreItemsToOrder.useMutation();
  const deleteOrder = api.order.deleteOne.useMutation();
  const removeItemFromOrder = api.order.removeItemFromOrder.useMutation();
  const updateOrder = api.order.updateOrder.useMutation();

  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    const isOrderExist = id || orderId;
    if (isOrderExist) {
      return addItemToOrder.mutate([
        { itemId, quantity, orderId: isOrderExist },
      ]);
    }
    return creteOrder.mutate();
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
