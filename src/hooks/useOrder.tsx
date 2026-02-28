"use client";
import { useCallback } from "react";
import type { Order, OrderStatus } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useOnlineStatus } from "@/lib/onlineStatus";
import { db } from "@/lib/db/localDb";
import { enqueue } from "@/lib/syncQueue";
import { useLocalSelectedTable } from "@/hooks/useLocalData";

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
  const { data: session } = useSession();
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
  const selectedTable = useLocalSelectedTable(session?.user.id);
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
      void (async () => {
        let targetOrderId = id ?? (orderId !== false ? orderId : undefined);

        if (!targetOrderId) {
          const userId = session?.user.id;
          if (!userId) return;
          // Reuse an existing local order if one was already created this session
          const existingLocal = await db.orders
            .filter((o) => o.selectedBy === userId)
            .first();
          if (existingLocal) {
            targetOrderId = existingLocal.id;
          } else {
            // First item offline — create a local order in Dexie
            const newOrderId = crypto.randomUUID();
            const selectedTableId =
              selectedTable && selectedTable !== "null" ? selectedTable.id : null;
            await db.orders.add({
              id: newOrderId,
              userId,
              selectedBy: userId,
              tableId: selectedTableId,
              status: "Pending",
              isPaid: false,
              guestLeft: false,
              specialRequest: null,
              billId: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            targetOrderId = newOrderId;
          }
        }

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
        // Enqueue WITHOUT orderId so server uses findOrCreateOrder → getSelectedByUser
        await enqueue("order.addItems", { itemId, quantity });
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
    if (!isOnline) {
      void (async () => {
        const userId = session?.user.id;
        if (!userId) return;
        await db.restaurantTables.update(tableId, {
          selectedBy: userId,
          updatedAt: new Date(),
        });
        const localTable = await db.restaurantTables.get(tableId);
        if (localTable) utils.table.getSelectedTable.setData(undefined, localTable as never);
        await enqueue("table.setSelectedTable", tableId);
        toast({ title: "Table selected offline" });
        await utils.table.invalidate();
      })();
      return;
    }
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
    const tableId = selectedTable && selectedTable !== "null" ? selectedTable.id : undefined;

    if (!isOnline) {
      // Resolve local order ID: prefer cached server orderId, fall back to Dexie
      let localOrderId = orderId !== false ? orderId : undefined;
      const userId = session?.user.id;
      if (!localOrderId && userId) {
        const localOrder = await db.orders
          .filter((o) => o.selectedBy === userId)
          .first();
        localOrderId = localOrder?.id;
      }
      if (!localOrderId) return;

      await db.orders.update(localOrderId, {
        status: "In Progress",
        selectedBy: null,
        tableId: tableId ?? null,
        updatedAt: new Date(),
      });
      // Use proceedCurrentOrder so replay works without needing the local UUID server-side
      await enqueue("order.proceedCurrentOrder", { tableId });

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
      router.push(`/orders/${localOrderId}`);
      return;
    }

    if (!orderId) return;

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
