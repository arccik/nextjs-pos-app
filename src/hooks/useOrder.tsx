"use client";
import { useCallback } from "react";
import type { Order, OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useOnlineStatus } from "@/lib/onlineStatus";
import { db } from "@/lib/db/localDb";
import { enqueue } from "@/lib/syncQueue";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};
type UtilsKeys = "order" | "table" | "bill" | "payment";

export default function useOrder() {
  const utils = api.useUtils();
  const router = useRouter();
  const isOnline = useOnlineStatus();
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

  const handleSuccess = useCallback(
    async (message: string, entity: UtilsKeys[]) => {
      toast({ title: message });
      await Promise.all(entity.map((e) => utils[e].invalidate()));
    },
    [utils],
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
    onSuccess: async () =>
      await handleSuccess("Order Updated", ["order", "table"]),
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

  // --- Action functions ---

  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    if (!isOnline) {
      const targetOrderId = id ?? (orderId !== false ? orderId : undefined);
      if (!targetOrderId) return;
      void (async () => {
        const existing = await db.orderItems
          .where("[orderId+itemId]")
          .equals([targetOrderId, itemId])
          .first();
        if (existing) {
          await db.orderItems.update([targetOrderId, itemId], {
            quantity: existing.quantity + quantity,
          });
        } else {
          await db.orderItems.add({
            orderId: targetOrderId,
            itemId,
            quantity,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
        await enqueue("order.addItems", { itemId, orderId: targetOrderId, quantity });
        toast({ title: "Item saved offline" });
        await utils.order.invalidate();
      })();
      return;
    }
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
    const tableId = selectedTable !== "null" ? selectedTable?.id : undefined;
    if (!orderId) return;

    if (!isOnline) {
      // Offline path: update local DB and queue mutations
      await db.orders.update(orderId, {
        status: "In Progress",
        selectedBy: null,
        tableId: tableId ?? null,
        updatedAt: new Date(),
      });
      await enqueue("order.updateOrder", {
        id: orderId,
        body: { status: "In Progress", selectedBy: null, tableId },
      });

      if (tableId) {
        await db.restaurantTables.update(tableId, {
          status: "occupied",
          updatedAt: new Date(),
        });
        await enqueue("table.changeStatus", { tableId, status: "occupied" });
        await enqueue("table.unselectTable", {});
      }

      toast({ title: "Order saved offline — will sync on reconnect" });
      await utils.invalidate();
      router.push(`/orders/${orderId}`);
      return;
    }

    updateOrder.mutate({
      id: orderId,
      body: {
        status: "In Progress",
        selectedBy: null,
        tableId,
      },
    });

    if (tableId) {
      await changeTableStatus.mutateAsync({
        tableId,
        status: "occupied",
      });
      await unselectTableMutation.mutateAsync();
    }
    router.push(`/orders/${orderId}`);
  };

  const changeStatus = ({
    status,
    orderId,
  }: {
    status: OrderStatus[number];
    orderId: string;
  }) => {
    if (!isOnline) {
      void (async () => {
        await db.orders.update(orderId, { status, updatedAt: new Date() });
        await enqueue("order.setStatus", { orderId, status });
        toast({ title: "Status saved offline" });
        await utils.order.invalidate();
      })();
      return;
    }
    setStatus.mutate({ orderId, status });
  };

  const setSelectedOrder = (orderId: string) => {
    selectOrder.mutate({ orderId });
  };

  const isLoading = addItem.isPending || addItemToOrder.isPending;

  return {
    selectedOrder: selectedOrder !== "null" && selectedOrder,
    selectedTable: selectedTable !== "null" && selectedTable,
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
