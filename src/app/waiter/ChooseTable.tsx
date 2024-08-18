"use client";

import type { TableStatus } from "@/server/db/schemas/table";
import { Button } from "@/components/ui/button";
import { BrushIcon, Check, XIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import useOrder from "@/hooks/useOrder";

type ChooseTableProps = {
  close: () => void;
};

export type SelectedTable = {
  id: string;
  number: number;
} | null;

export default function ChooseTable({ close }: ChooseTableProps) {
  const router = useRouter();

  const { selectedOrder, unselectTable, selectTable } = useOrder();
  const {
    data: tables,
    isLoading: isTablesLoading,
    refetch: refetchTables,
  } = api.table.getAll.useQuery();

  const handleTableSelect = (tableId: string) => {
    selectTable(tableId);
    router.push("/menu");
    close();
  };

  const handleTableDiselect = () => {
    unselectTable();
    // close();
  };

  const statusIcon: Record<TableStatus, React.ReactNode> = {
    available: <Check />,
    occupied: <XIcon />,
    closed: <BrushIcon />,
    reserved: "🔒",
  };

  if (selectedOrder?.table) {
    return (
      <div className="flex items-center justify-center gap-4">
        <p>You Have selected table number {selectedOrder?.table.number}</p>
        <Button size="icon" onClick={() => handleTableDiselect()}>
          <XIcon />
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
