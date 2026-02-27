"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, PoundSterling } from "lucide-react";
import { cn } from "@/lib/utils";

import TableDetails from "./TableDetails";
import TableButton from "./TableButton";
import EmptyTable from "./Emptytable";
import { format } from "date-fns";
import { type TableWithReservation } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import ActionButtons from "@/components/ActionButtons";
import Loading from "@/components/Loading";
import useOrder from "@/hooks/useOrder";
import { Cross1Icon } from "@radix-ui/react-icons";
import { formatId } from "@/lib/utils";
import { AdminMenu } from "./AdminMenu";
import { statusConfig } from "./TableButton";

type TableCardProps = {
  tableData: TableWithReservation;
};

export default function TableCard({ tableData }: TableCardProps) {
  const tableId = tableData.id;
  const enabled = tableData.status === "occupied";
  const { data: orderData, isLoading } = api.order.getOneByTableId.useQuery(
    { tableId },
    { enabled },
  );
  const { unselectTable, selectedTable } = useOrder();

  const DeselectButton = () => {
    if (selectedTable && selectedTable.id === tableData.id)
      return (
        <Button size="sm" variant="ghost" onClick={unselectTable}>
          <Cross1Icon className="text-red-500" />
          Deselect
        </Button>
      );
    return null;
  };

  const hasOrder = !isLoading && !!orderData && orderData !== "null";
  const hStyle = statusConfig[tableData.status] ?? statusConfig.closed;

  return (
    <Dialog>
      <DialogTrigger className="block w-full text-left">
        <TableButton tableData={tableData} />
      </DialogTrigger>

      <DialogContent className="overflow-hidden !p-0 sm:max-w-[480px] [&>button:last-child]:hidden">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header — tinted to match the table card's status colour */}
          <div className={cn("shrink-0 border-b border-l-4 px-5 py-4", hStyle.accent, hStyle.bg)}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold">
                    Table{" "}
                    {tableData.prefix ? `${tableData.prefix}-` : "#"}
                    {tableData.number}
                  </h2>
                  <DeselectButton />
                  <AdminMenu tableId={tableId} />
                </div>

                {tableData.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {tableData.description}
                  </p>
                )}

                {hasOrder && orderData.userId && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Order {formatId(orderData.id)} · {orderData.creator.name} ·{" "}
                    {format(tableData.createdAt, "dd MMM yyyy HH:mm")}
                  </p>
                )}

                {hasOrder && (
                  <div className="mt-2 flex gap-2">
                    <Badge className="border border-green-500 text-xs">
                      {orderData.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <PoundSterling size={10} className="mr-1" />
                      {orderData.isPaid ? "Paid" : "Not paid"}
                    </Badge>
                  </div>
                )}
              </div>

              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <X size={16} />
                </Button>
              </DialogClose>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {isLoading ? (
              <Loading />
            ) : tableData.status === "occupied" ? (
              hasOrder ? (
                <TableDetails data={orderData} />
              ) : null
            ) : (
              <EmptyTable
                tableId={tableData.id}
                tableNumber={tableData.number}
                clean={!tableData.requireCleaning}
              />
            )}
          </div>

          {/* Footer */}
          {hasOrder && tableData.status === "occupied" && (
            <div className="shrink-0 border-t px-5 py-3">
              <ActionButtons
                isPaid={orderData.isPaid}
                orderId={orderData.id}
                status={orderData.status}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
