import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import type { Item, Order } from "@/server/db/schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { makeReady } from "@/api/orders";
import { api } from "@/trpc/react";
import { MainOrder, OrderWithItems } from "@/server/models/order";

export const columns: ColumnDef<OrderWithItems>[] = [
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => <div>{(row.getValue("orders") as Order)?.id}</div>,
  },
  {
    accessorKey: "items",
    header: () => <p className="text-xs">Items</p>,
    cell: (data) => {
      const item = data.row.getValue("items") as Item;

      return <div className="ml-4">{item?.id}</div>;
    },
  },
  {
    accessorKey: "quantity",
    header: () => <p className="text-xs">Quantity</p>,
    cell: (data) => {
      return (
        <div className="ml-4 lowercase">{data.row.getValue("quantity")}</div>
      );
    },
  },
  {
    accessorKey: "action",
    header: () => <p className="text-xs">Action</p>,
    cell: (data) => {
      const order = data.row.getValue("orders") as Order;
      const orderStatus = order?.status;
      //   const queryClient = useQueryClient();

      //   const ready = useMutation({
      //     mutationFn: () => makeReady(order.id, data.row.original.items.id),
      //     onSuccess: () => {
      //       queryClient.invalidateQueries({ queryKey: ["orders"] });
      //     },
      //     onError: (error) => {
      //       console.error("Sometning went wrong", error);
      //     },
      //   });
      console.log("ITEM ID: ", data);
      return (
        <div className="flex gap-2">
          <Button size="sm">Accept order</Button>
          <Button
            // onClick={() => ready.mutate()}
            disabled={orderStatus !== "In Progress"}
            size="sm"
            variant="outline"
          >
            Ready?
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "orders",
    header: () => <p className="text-xs">Status</p>,
    cell: ({ row }) => {
      const order = row.getValue("orders") as Order;
      return <div className="text-[10px]">{order?.status}</div>;
    },
  },
];
