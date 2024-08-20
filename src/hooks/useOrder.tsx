"use client";
import { Order } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};

export default function useOrder() {
  const { data: order, refetch: refetchOrder } =
    api.order.getSelectedByUser.useQuery();
  const { data: table, refetch: refetchTable } =
    api.table.getSelectedTable.useQuery();
  const utils = api.useUtils();

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
      // utils.order.invalidate();
      refetchOrder();
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
      refetchOrder();
      refetchTable();
      utils.order.invalidate();
      utils.table.invalidate();
    },
  });

  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    const isOrderExist = id || order?.id;
    console.log("IS EXIST : ", { isOrderExist });
    addItem.mutate({ itemId, orderId: id, quantity });
    // if (isOrderExist) {
    //   return addItemToOrder.mutate([
    //     { itemId, quantity, orderId: isOrderExist },
    //   ]);
    // } else {
    //   console.log("BEFORE ----- ORder Not Exist. creating Order: ", orderId);
    //   const response = creteOrder.mutate();
    //   console.log("AFTER ------ ORder Not Exist. creating Order: ", {
    //     response,
    //     oth: creteOrder.data,
    //   });

    //   return addItemToOrder.mutate([{ itemId, quantity, orderId }]);
    // }
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
    console.log("Aaaa ");
    setSelectedTable.mutate(tableId);
    if (order?.id) {
      updateOrder.mutate({
        id: order.id,
        body: { tableId, userId: order?.userId },
      });
    }
  };

  const unselectTable = () => {
    unselect.mutate();
    if (order?.id) {
      updateOrder.mutate({
        id: order.id,
        body: { tableId: null, userId: order?.userId },
      });
      utils.order.invalidate();
    }
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
  };
}
