"use client";
import { Order, OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { OrderItemsBill } from "@/server/models/order";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};

export default function useOrder() {
  const [order, setOrder] = useState<OrderItemsBill | null>(null);
  const utils = api.useUtils();
  const { data: selectedOrder } = api.order.getSelectedByUser.useQuery();
  const { data: table } = api.table.getSelectedTable.useQuery();
  const setStatus = api.order.setStatus.useMutation({
    onSuccess: () => {
      toast({ title: "Order Status Changed" });
      utils.order.invalidate();
    },
  });

  useEffect(() => {
    if (selectedOrder) {
      setOrder(selectedOrder);
    }
  }, [selectedOrder]);

  const addItem = api.order.addItems.useMutation({
    onSuccess: () => {
      utils.order.invalidate();

      toast({
        title: "Item Added",
        description: "Your order has been updated successfully",
      });
    },
  });
  const addItemToOrder = api.order.addMoreItemsToOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "Your order has been updated successfully",
      });
      utils.order.invalidate();
    },
  });
  const deleteOrder = api.order.deleteOne.useMutation({
    onSuccess: () => {
      toast({
        title: "Order deleted",
        description: "Your order has been deleted successfully",
      });
      utils.order.invalidate();
    },
  });
  const removeItemFromOrder = api.order.removeItemFromOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "Your order has been updated successfully",
      });
      utils.order.invalidate();
    },
  });
  const updateOrder = api.order.updateOrder.useMutation({
    onSuccess: () => {
      toast({
        title: "Order updated",
        description: "Your order has been updated successfully",
      });

      utils.order.invalidate();
      utils.table.invalidate();
    },
  });

  const unselect = api.table.unselectTable.useMutation({
    onSuccess: () => {
      toast({ title: "Table Unselected" });

      utils.order.invalidate();
      utils.table.invalidate();
    },
    onError: (err) => {
      console.log("ERROR:UNSELECTING ", err);
    },
  });
  const setSelectedTable = api.table.setSelectedTable.useMutation({
    onSuccess: () => {
      toast({ title: "Table Selected" });

      utils.order.invalidate();
      utils.table.invalidate();
    },
  });

  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    addItem.mutate({ itemId, orderId: id, quantity });
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

  const selectTable = (tableId: string) => {
    setSelectedTable.mutate(tableId);
    if (order?.id) {
      updateOrder.mutate({
        id: order.id,
        body: { tableId },
      });
    }
  };

  const unselectTable = () => {
    unselect.mutate();
    if (order?.id) {
      updateOrder.mutate({
        id: order.id,
        body: { tableId: null },
      });
    }
  };

  const proceedOrder = () => {
    if (!order?.id) return;
    unselect.mutate();
    updateOrder.mutate({
      id: order.id,
      body: { status: "In Progress", selectedBy: null },
    });

    setOrder(null);
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
    selectedTable: table,
    selectTable,
    unselectTable,
    add,
    update,
    deleteOne,
    removItem,
    isLoading,
    proceedOrder,
    changeStatus,
  };
}
