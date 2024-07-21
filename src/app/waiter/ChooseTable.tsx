// import { useQuery } from "@tanstack/react-query";
// import { getAll } from "@/api/tables";
// import Loading from "@/components/layout/Loading";
// import Error from "@/components/layout/Error";
import type { Table, TableStatus } from "@/server/db/schemas/table";
// import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { BrushIcon, Check } from "lucide-react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { api } from "@/trpc/react";

type ChooseTableProps = {
  close: () => void;
};
export default function ChooseTable({ close }: ChooseTableProps) {
  // const { setSelectedTable } = useStore();

  const { data: tables } = api.table.getAll.useQuery();
  const setSelectedTable = ({
    tableId,
    number,
  }: {
    tableId: string;
    number: number;
  }) => console.log("table selected");

  // const {
  //   data: tables,
  //   isLoading,
  //   isError,
  // } = useQuery<Table[]>({ queryKey: ["tables"], queryFn: () => getAll() });

  const handleTableClick = (table: Table) => {
    setSelectedTable({ tableId: table.id, number: table.number });
    close();
  };
  // if (isLoading) return <Loading />;
  // if (isError) return <Error />;

  const statusIcon: Record<TableStatus, React.ReactNode> = {
    available: <Check />,
    occupied: <Cross1Icon />,
    closed: <BrushIcon />,
    reserved: "🔒",
  };
  return (
    <section className="mx-auto">
      <div className="flex flex-wrap place-content-between gap-4">
        {tables?.map((table) => (
          <Button
            variant="outline"
            disabled={table.status !== "available"}
            onClick={() => handleTableClick(table)}
            key={table.id}
            className="grid size-32 cursor-pointer place-content-center gap-2 rounded-xl border-2 p-2"
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
