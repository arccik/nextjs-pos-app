"use client";
import { Order } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import useLocalStorage from "./useLocalStorage";

type AddToOrderProps = {
  itemId: string;
  quantity: number;
  id?: string;
};

export default function useOrder(id?: string) {
  // const [orderId, setOrderId] = useState<string | undefined>(id);
  const [orderId, setOrderId] = useLocalStorage("orderId", id);
  const router = useRouter();
  const utils = api.useUtils();
  const creteOrder = api.order.newOrder.useMutation({
    onSuccess: (data) => {
      // data && setOrderId(data.id);
      // router.push(`/${data?.id}`);
      console.log("CREATED ORDER: ", { data });

      // router.replace(`?orderId=${data?.id}`);
      setOrderId(data?.id);
      utils.order.invalidate();

      toast({
        title: "Order created",
        description: "Your order has been created successfully",
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
      setOrderId(undefined);
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
    },
  });

  const add = ({ itemId, quantity, id }: AddToOrderProps) => {
    toast({
      title: "Order creating...",
      description: "Your order has been created successfully",
    });
    const isOrderExist = id || orderId;
    console.log("IS EXIST : ", { isOrderExist });
    if (isOrderExist) {
      return addItemToOrder.mutate([
        { itemId, quantity, orderId: isOrderExist },
      ]);
    } else {
      console.log("BEFORE ----- ORder Not Exist. creating Order: ", orderId);
      const response = creteOrder.mutate();
      console.log("AFTER ------ ORder Not Exist. creating Order: ", {
        response,
        oth: creteOrder.data,
      });

      return addItemToOrder.mutate([{ itemId, quantity, orderId }]);
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
    deleteOne,
    removItem,
    isLoading,
  };
}
