"use client";
import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { type OrderItemsBill } from "@/server/models/order";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};
type UtilsKeys = "order" | "table" | "bill" | "payment";

export default function useOrder() {
  const [order, setOrder] = useState<OrderItemsBill | null>(null);
  const utils = api.useUtils();

  const { data: selectedOrder } = api.order.getSelectedByUser.useQuery();
  const { data: selectedTable } = api.table.getSelectedTable.useQuery();

  // Utility function to handle successful mutations
  const handleSuccess = async (message: string, entity: UtilsKeys) => {
    toast({ title: message });
    await utils[entity].invalidate();
  };

  // Mutations
  const setStatus = api.order.setStatus.useMutation({
    onSuccess: () => handleSuccess("Order Status Changed", "order"),
  });

  const addItem = api.order.addItems.useMutation({
    onSuccess: () => handleSuccess("Item Added", "order"),
  });

  const addItemToOrder = api.order.addMoreItemsToOrder.useMutation({
    onSuccess: () => handleSuccess("Order Updated", "order"),
  });

  const deleteOrder = api.order.deleteOne.useMutation({
    onSuccess: () => handleSuccess("Order Deleted", "order"),
  });

  const removeItemFromOrder = api.order.removeItemFromOrder.useMutation({
    onSuccess: () => handleSuccess("Order Updated", "order"),
  });

  const updateOrder = api.order.updateOrder.useMutation({
    onSuccess: async () => {
      await handleSuccess("Order Updated", "order");
      await utils.table.invalidate();
    },
  });

  const changeTableStatus = api.table.changeStatus.useMutation({
    onSuccess: () => handleSuccess("Table Status Changed", "table"),
  });

  const unselectTableMutation = api.table.unselectTable.useMutation({
    onSuccess: async () => {
      await utils.order.invalidate();
      await utils.table.invalidate();
    },
  });

  const setSelectedTable = api.table.setSelectedTable.useMutation({
    onSuccess: () => handleSuccess("Table Selected", "table"),
  });

  useEffect(() => {
    if (selectedOrder) {
      setOrder((prevOrder) => ({
        ...selectedOrder,
        table: selectedTable ?? prevOrder?.table ?? null,
      }));
    }
  }, [selectedOrder, selectedTable]);

  // Action functions
  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    addItem.mutate({ itemId, orderId: id, quantity });
  };

  const deleteOne = (id: string) => {
    deleteOrder.mutate({ id });
  };

  const removeItem = ({
    itemId,
    orderId,
  }: {
    itemId: string;
    orderId: string;
  }) => {
    removeItemFromOrder.mutate({ itemId, orderId });
  };

  const update = ({ id, body }: { id: string; body: Order }) => {
    updateOrder.mutate({ id, body });
  };

  const selectTable = (tableId: string) => {
    setSelectedTable.mutate(tableId);
    if (order?.id) {
      updateOrder.mutate({ id: order.id, body: { tableId } });
    }
  };

  const unselectTable = () => {
    unselectTableMutation.mutate();
    if (order?.id) {
      updateOrder.mutate({ id: order.id, body: { tableId: null } });
    }
  };

  const proceedOrder = () => {
    if (!order?.id) return;
    unselectTableMutation.mutate();
    updateOrder.mutate({
      id: order.id,
      body: { status: "In Progress", selectedBy: null },
    });
    if (!updateOrder.isPending) {
      setOrder(null);
    }
    if (selectedTable?.id) {
      changeTableStatus.mutate({
        tableId: selectedTable.id,
        status: "occupied",
      });
    }
  };

  const changeStatus = ({
    status,
    orderId,
  }: {
    status: OrderStatus[number];
    orderId: string;
  }) => {
    setStatus.mutate({ orderId, status });
  };

  const isLoading = addItem.isPending || addItemToOrder.isPending;

  return {
    selectedOrder: order,
    selectedTable,
    selectTable,
    unselectTable,
    add,
    update,
    deleteOne,
    removeItem,
    isLoading,
    proceedOrder,
    changeStatus,
  };
}
