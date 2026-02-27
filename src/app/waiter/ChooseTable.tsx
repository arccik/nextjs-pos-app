"use client";

import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import useOrder from "@/hooks/useOrder";
import TableButton from "../tables/TableButton";

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
  const { data: tables, isLoading: isTablesLoading } = api.table.getAll.useQuery();

  const handleTableSelect = (tableId: string) => {
    selectTable(tableId);
    router.push("/menu");
    close();
  };

  const handleTableDeselect = () => {
    unselectTable();
  };

  if (selectedOrder && selectedOrder?.table) {
    return (
      <div className="flex items-center justify-between rounded-xl border px-4 py-3">
        <div>
          <p className="text-xs text-muted-foreground">Currently selected</p>
          <p className="text-lg font-bold">Table #{selectedOrder.table.number}</p>
        </div>
        <Button size="sm" variant="outline" onClick={handleTableDeselect}>
          <XIcon size={14} className="mr-1" />
          Remove
        </Button>
      </div>
    );
  }

  if (isTablesLoading) return <Loading />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {tables?.map((table) => {
        const isDisabled = table.status !== "available" || !!table.selectedBy;
        return (
          <button
            key={table.id}
            disabled={isDisabled}
            onClick={() => handleTableSelect(table.id)}
            className={cn(
              "block w-full text-left transition-opacity",
              isDisabled && "cursor-not-allowed opacity-40",
            )}
          >
            <TableButton tableData={table} />
          </button>
        );
      })}
    </div>
  );
}
