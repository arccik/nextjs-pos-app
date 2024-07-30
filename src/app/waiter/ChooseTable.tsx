"use client";

import type { Table, TableStatus } from "@/server/db/schemas/table";
import { Button } from "@/components/ui/button";
import { BrushIcon, Check, XIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import useLocalStorage from "@/hooks/useLocalStorageOrderData";

type ChooseTableProps = {
  close: () => void;
};

type OrderLocalStorage = {
  tableId: string | null;
  items: {
    itemId: string;
    quantity: number;
    name: string;
    price: number;
  }[];
  orderId?: string;
};

export default function ChooseTable({ close }: ChooseTableProps) {
  const router = useRouter();
  const [localOrder, setLocalOrder] = useLocalStorage();
  const {
    data: tables,
    isLoading: isTablesLoading,
    refetch: refetchTables,
  } = api.table.getAll.useQuery();

  const { data: selectedTable, refetch: refetchSelectedTable } =
    api.table.getSelectedTable.useQuery();

  const select = api.table.setSelectedTable.useMutation({
    onSuccess: () => {
      toast({ title: `Table Selected` });
      refetchSelectedTable();
      refetchTables();
      router.push("/menu");
    },
  });

  const unselect = api.table.unselectTable.useMutation({
    onSuccess: () => {
      toast({ title: "Table Unselected" });
      refetchSelectedTable();
      refetchTables();
      router.refresh();
    },
  });

  const handleTableSelect = (tableId: string) => {
    select.mutate(tableId);
    close();
    setLocalOrder({ tableId });
  };

  const handleTableDiselect = (tableId: string) => {
    unselect.mutate({ tableId });
    setLocalOrder({ tableId: null });
    close();
  };

  const statusIcon: Record<TableStatus, React.ReactNode> = {
    available: <Check />,
    occupied: <XIcon />,
    closed: <BrushIcon />,
    reserved: "🔒",
  };

  if (selectedTable) {
    return (
      <div className="flex items-center justify-center gap-4">
        <p>You Have selected table number {selectedTable.number}</p>
        <Button
          size="icon"
          onClick={() => handleTableDiselect(selectedTable.id)}
        >
          <XIcon />
          {unselect.isPending && <Loading />}
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto">
      <div className="flex flex-wrap place-content-between gap-4">
        {isTablesLoading && <Loading />}
        {tables?.map((table) => (
          <Button
            variant="outline"
            disabled={table.status !== "available" || !!table.selectedBy}
            onClick={() => handleTableSelect(table.id)}
            key={table.id}
            className={cn(
              "grid size-32 cursor-pointer place-content-center gap-2 rounded-xl border-2 p-2",
              {
                "border-4 border-green-500": !!table.selectedBy,
              },
            )}
          >
            <p className="text-2xl">{table.number}</p>
            <p className="flex items-center gap-2 capitalize">
              {statusIcon[table.status]} {table.status}
            </p>
            <p>
              {table.seats}
              {table.seats === 1 ? " Seat" : " Seats"}
            </p>
          </Button>
        ))}
      </div>
    </section>
  );
}
