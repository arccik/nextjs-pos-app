"use client";
import { useCallback } from "react";
import type { Order, OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};
type UtilsKeys = "order" | "table" | "bill" | "payment";

export default function useOrder() {
  const utils = api.useUtils();

  const { data: selectedOrder } = api.order.getSelectedByUser.useQuery();

  const selectOrder = api.order.selectOrder.useMutation({
    onSuccess: async () => {
      await utils.order.getSelectedByUser.invalidate();
    },
  });
  const unselectOrder = api.order.unselectOrder.useMutation({
    onSuccess: async () => {
      await utils.order.getSelectedByUser.invalidate();
    },
  });
  const { data: selectedTable } = api.table.getSelectedTable.useQuery();
  const orderId = selectedOrder !== "null" && selectedOrder?.id;
  // Utility function to handle successful mutations
  const handleSuccess = useCallback(
    async (message: string, entity: UtilsKeys[]) => {
      toast({ title: message });
      await Promise.all(entity.map((e) => utils[e].invalidate()));
    },
    [utils, selectedOrder],
  );

  const setStatus = api.order.setStatus.useMutation({
    onSuccess: () => handleSuccess("Order Status Changed", ["order"]),
  });

  const addItem = api.order.addItems.useMutation({
    onSuccess: () => handleSuccess("Item Added", ["order"]),
  });

  const addItemToOrder = api.order.addMoreItemsToOrder.useMutation({
    onSuccess: () => handleSuccess("Order Updated", ["order"]),
  });

  const deleteOrder = api.order.deleteOne.useMutation({
    onSuccess: () => handleSuccess("Order Deleted", ["order", "table"]),
  });

  const removeItemFromOrder = api.order.removeItemFromOrder.useMutation({
    onSuccess: async () => await handleSuccess("Order Updated", ["order"]),
  });

  const updateOrder = api.order.updateOrder.useMutation({
    onSuccess: async () => {
      await handleSuccess("Order Updated", ["order", "table"]);
    },
  });

  const changeTableStatus = api.table.changeStatus.useMutation({
    onSuccess: () => handleSuccess("Table Status Changed", ["table"]),
  });

  const unselectTableMutation = api.table.unselectTable.useMutation({
    onSuccess: async () => handleSuccess("Table unselected", ["table"]),
  });

  const setSelectedTable = api.table.setSelectedTable.useMutation({
    onSuccess: () => handleSuccess("Table Selected", ["table"]),
  });

  // useEffect(() => {
  //   if (selectedOrder) {
  //     setOrder((prevOrder) => ({
  //       ...selectedOrder,
  //       table: selectedTable ?? prevOrder?.table ?? null,
  //     }));
  //   }
  // }, [selectedOrder, selectedTable]);

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
    if (orderId) {
      updateOrder.mutate({ id: orderId, body: { tableId } });
    }
  };

  const unselectTable = () => {
    unselectTableMutation.mutate();
    if (orderId) {
      updateOrder.mutate({ id: orderId, body: { tableId: null } });
    }
  };

  const proceedOrder = async () => {
    if (!orderId) return;
    unselectTableMutation.mutate();
    updateOrder.mutate({
      id: orderId,
      body: { status: "In Progress", selectedBy: null },
    });

    if (selectedTable !== "null" && selectedTable?.id) {
      await changeTableStatus.mutateAsync({
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

  const setSelectedOrder = (orderId: string) => {
    selectOrder.mutate({ orderId });
  };

  const isLoading = addItem.isPending || addItemToOrder.isPending;

  return {
    selectedOrder: selectedOrder !== "null" && selectedOrder,
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
    setSelectedOrder,
    unselectOrder,
  };
}
