"use client";
// import { useMutation, useQuery } from "@tanstack/react-query";
import RecentOrders from "./RecentOrders";
// import { recentCompletedOrders } from "@/api/orders";
// import { type OrderWithUserAndBill } from "@/server/db/schemas";
// import Error from "../layout/Error";
import { Button } from "@/components/ui/button";
// import { markClean } from "@/api/tables";
// import { useToast } from "@/components/ui/use-toast";
// import { useStore } from "@/store";
import { PlusIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
// import { setSelectedTable } from "@/server/models/table";

type EmptytableProps = { tableId: string; clean: boolean; tableNumber: number };

export default function EmptyTable({
  tableId,
  clean,
  tableNumber,
}: EmptytableProps) {
  const router = useRouter();

  const setSelectedTable = api.table.setSelectedTable.useMutation({
    onSuccess: () => {
      toast({
        title: "Table selected",
      });
    },
  });
  //   const { toast } = useToast();
  //   const { setSelectedTable } = useStore();
  const userId = 1;

  //   const { data, isLoading, isError } = useQuery<OrderWithUserAndBill[]>({
  //     queryKey: ["table", tableId],
  //     queryFn: () => recentCompletedOrders(tableId),
  //   });
  //   const makeClean = useMutation({
  //     mutationFn: () => markClean(tableId),
  //     onSuccess: () => toast({ title: "Table marked as clean" }),
  //     onError: (error) => {
  //       console.error("Mark table as clean went wrong..", error);
  //       toast({ title: "Something went wrong...", variant: "destructive" });
  //     },
  //   });

  const handleAddNewOrder = async () => {
    // setSelectedTable({ tableId, number: tableNumber });
    setSelectedTable.mutate(tableId);
    router.push(`/menu?tableId=${tableId}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="my-4 flex items-center justify-evenly">
        <p>Table: {clean ? <b>Clean</b> : <b>Require cleaning</b>}</p>
        <Button variant="outline" onClick={handleAddNewOrder} size="sm">
          <PlusIcon className="mr-1" /> New Order
        </Button>
      </div>
      <RecentOrders tableId={tableId} />
      {!clean && (
        <Button
          variant="outline"
          //  onClick={() => makeClean.mutate()}

          size="sm"
        >
          Mark as clean
        </Button>
      )}
    </div>
  );
}
