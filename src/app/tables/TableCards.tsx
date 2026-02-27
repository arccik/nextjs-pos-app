"use client";
import { useState } from "react";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import TableCard from "./TableCard";
import AddTable from "./AddTable";
type FilterStatus = "available" | "occupied" | "reserved";
import Loading from "@/components/Loading";
import AddReservation from "@/components/reservations/AddReservation/AddReservation";
import { UtensilsCrossed } from "lucide-react";

type TableGridProps = {
  standalone?: boolean;
};

const filterOptions: { label: string; value: FilterStatus | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Available", value: "available" },
  { label: "Occupied", value: "occupied" },
  { label: "Reserved", value: "reserved" },
];

export default function TableCards({ standalone }: TableGridProps) {
  const [status, setStatus] = useState<FilterStatus | undefined>();

  const { data: allTables, refetch, isLoading } = api.table.getAll.useQuery(undefined);

  const tables = status ? allTables?.filter((t) => t.status === status) : allTables;

  const counts = {
    available: allTables?.filter((t) => t.status === "available").length ?? 0,
    occupied: allTables?.filter((t) => t.status === "occupied").length ?? 0,
    reserved: allTables?.filter((t) => t.status === "reserved").length ?? 0,
  };

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Tables</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-sm text-muted-foreground">
            {allTables?.length ?? 0}
          </span>
        </div>
        <div className="flex gap-2">
          <AddReservation />
          <AddTable onComplete={refetch} />
        </div>
      </div>

      {/* Stats line */}
      {allTables && (
        <p className="mb-3 text-sm text-muted-foreground">
          {counts.available} available · {counts.occupied} occupied · {counts.reserved} reserved
        </p>
      )}

      {/* Filter chips */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filterOptions.map((f) => {
          const count =
            f.value !== undefined ? (counts[f.value] ?? 0) : (allTables?.length ?? 0);
          const isActive = status === f.value;
          return (
            <button
              key={f.label}
              onClick={() => setStatus(f.value)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "min-w-[1.25rem] rounded-full px-1 py-0.5 text-center text-xs",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      {!!tables?.length ? (
        <div
          className={cn("grid grid-cols-2 gap-3", standalone && "sm:grid-cols-3 lg:grid-cols-4")}
        >
          {tables.map((table) => (
            <TableCard key={table.id} tableData={table} />
          ))}
        </div>
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="my-16 flex flex-col items-center gap-2 text-muted-foreground">
          <UtensilsCrossed size={32} className="opacity-40" />
          <p>No {status ?? ""} tables found</p>
        </div>
      )}
    </div>
  );
}
