"use client";

import type { Table, TableStatus } from "@/server/db/schemas/table";
import { Button } from "@/components/ui/button";
import { BrushIcon, Check, XIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

type ChooseTableProps = {
  close: () => void;
};

export default function ChooseTable({ close }: ChooseTableProps) {
  const router = useRouter();
  const {
    data: tables,
    isLoading: tablesLoading,
    refetch: refetchTables,
  } = api.table.getAll.useQuery();

  const { data: selectedTable, refetch: refetchSelectedTable } =
    api.table.getSelectedTable.useQuery();

  const select = api.table.setSelectedTable.useMutation({
    onSuccess: () => {
      toast({ title: `Table Selected` });
      refetchSelectedTable();
      refetchTables();
    },
  });

  const unselect = api.table.unselectTable.useMutation({
    onSuccess: () => {
      toast({ title: "Table Unselected" });
      refetchSelectedTable();
      refetchTables();
    },
  });

  const handleTableSelect = (tableId: string) => {
    select.mutate(tableId);
    close();
  };

  const statusIcon: Record<TableStatus, React.ReactNode> = {
    available: <Check />,
    occupied: <XIcon />,
    closed: <BrushIcon />,
    reserved: "🔒",
  };

  if (selectedTable && selectedTable.length > 0) {
    return (
      <div className="flex items-center justify-center gap-4">
        <p>You Have selected table number {selectedTable[0].number}</p>
        <Button
          size="icon"
          onClick={() => unselect.mutate({ tableId: selectedTable[0].id })}
        >
          <XIcon />
          {/* Remove */}
        </Button>
      </div>
    );
  }

  return (
    <section className="mx-auto">
      <div className="flex flex-wrap place-content-between gap-4">
        {tables?.map((table) => (
          <Button
            variant="outline"
            disabled={table.status !== "available" || !!table.selectedBy}
            onClick={() => handleTableSelect(table.id)}
            key={table.id}
            className={cn(
              "grid size-32 cursor-pointer place-content-center gap-2 rounded-xl border-2 p-2",
              {
                "border-4 border-green-500":
                  table.selectedBy === "d9a4b19f-a619-4013-b40f-8af693cd2bf2",
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
