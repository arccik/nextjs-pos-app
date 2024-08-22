import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";


export default function useCookedItem(orderId: string) {
  // Implement the logic to add and remove cooked items from the order

  const { data: cookedItems, refetch: refetchCookedItems } =
    api.cookedItem.getAll.useQuery(orderId);
  const { data: order, refetch: refetchOrder } = api.order.getOne.useQuery({
    id: orderId,
  });
  const utils = api.useUtils();

  const createCookedItem = api.cookedItem.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Item Added",
        description: `Item been added to the order.`,
      });
      refetchCookedItems();
      utils.cookedItem.invalidate();
    },
  });
  const removeCookedItem = api.cookedItem.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Item Removed",
        description: `Item been removed from the order.`,
      });
      refetchCookedItems();
      utils.cookedItem.invalidate();
    },
  });

  const setOrderReady = api.order.setStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Order is ready",
      });
      utils.order.invalidate();
    },
  });
  const isAllChecked = cookedItems?.length === order?.orderItems.length;
  return {
    add: (itemId: string) => {
      createCookedItem.mutate({ itemId, orderId });
    },
    remove: (itemId: string) => {
      removeCookedItem.mutate({ itemId, orderId });
    },
    setOrderReady: () => {
      setOrderReady.mutate({ orderId, status: "Ready" });
    },
    cookedItems: cookedItems?.map((v) => v.itemId) ?? [],
    isAllChecked,
  };
}
