"use client";
import RecentOrders from "./RecentOrders";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import useOrder from "@/hooks/useOrder";
import { useRouter } from "next/navigation";

type EmptytableProps = { tableId: string; clean: boolean; tableNumber: number };

export default function EmptyTable({ tableId, clean }: EmptytableProps) {
  const { selectTable } = useOrder();
  const router = useRouter();

  const handleAddNewOrder = async () => {
    selectTable(tableId);
    router.push("/menu");
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
