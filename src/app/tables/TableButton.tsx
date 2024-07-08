import { Card, CardContent, CardHeader } from "../ui/card";
import { cn } from "@/lib/utils";
import { Notebook } from "lucide-react";
import { type TableWithReservation } from "@server/src/schemas";

type TableButtonProps = {
  tableData: TableWithReservation;
};

export default function TableButton({ tableData }: TableButtonProps) {
  return (
    <Card
      className={cn("rounded-xl transition-all", {
        "border-gray-400 border-spacing-x-1.5": tableData.status === "occupied",
        "border-red-700": tableData.status === "reserved",
      })}
    >
      <CardHeader className="p-4 rounded-t-xl border-b grid grid-cols-2 items-center">
        <div>
          <h2 className="text-xl font-bold">
            {tableData.prefix && `${tableData.prefix}-`}
            {tableData.number}
          </h2>
          <p className="text-sm leading-none">{tableData.description}</p>
        </div>
        <div>
          <p
            className={cn("text-xs leading-none", {
              "font-bold": tableData.status === "occupied",
              "text-red-700": tableData.status === "reserved",
              "text-gray-400": tableData.status === "available",
            })}
          >
            {tableData.status}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-2 flex items-center gap-2 justify-center">
        {!!tableData.reservations.length && (
          <div className="flex items-center">
            <Notebook />
            <p className="text-xs leading-none">Reserved until {tableData.reservations[0].expireAt}</p>
          </div>
        )}
        {!!tableData.reservations.length && <div className="border-l h-8" />}
        <div className="flex flex-col">
          <p className="text-xs leading-none">Seats</p>
          <p className="text-sm leading-none font-semibold">{tableData.seats}</p>
        </div>
      </CardContent>
    </Card>
  );
}