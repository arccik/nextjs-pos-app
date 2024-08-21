import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

type UseCookedItemProps = {
  orderId: string;
};
export default function useCookedItem({ orderId }: UseCookedItemProps) {
  // Implement the logic to add and remove cooked items from the order
  const createCookedItem = api.cookedItem.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Item Added",
        description: `Item been added to the order.`,
      });
    },
  });
  const deleteCookedItem = api.cookedItem.delete.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Item Removed",
        description: `Item been removed from the order.`,
      });
    },
  });
  return {
    add: (itemId: string) => {
      createCookedItem.mutate({ itemId, orderId });
    },
    remove: (itemId: string) => {
      deleteCookedItem.mutate({ itemId, orderId });
    },
  };
}
