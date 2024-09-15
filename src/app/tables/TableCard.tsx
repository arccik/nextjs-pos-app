"use client";
import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  // DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
// import { EllipsisVertical } from "lucide-react";
import { AdminMenu } from "./AdminMenu";

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
    if (selectedTable && selectedTable?.id === tableData.id)
      return (
        <Button size="sm" variant="ghost" onClick={unselectTable}>
          <Cross1Icon className="text-red-500" />
          Deselect
        </Button>
      );
  };

  if (isLoading) return <Loading />;
  return (
    <Dialog>
      <DialogTrigger>
        <TableButton tableData={tableData} />
      </DialogTrigger>
      <DialogContent title={`Table #${tableData.number}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <div>
              Table #{tableData.prefix}
              {tableData.number}
            </div>
            <div className="ml-2">
              <DeselectButton />
              <AdminMenu tableId={tableId} />
            </div>
          </DialogTitle>
          <DialogDescription className="flex justify-between">
            {tableData.description}
          </DialogDescription>
          {orderData !== "null" && orderData?.userId && (
            <>
              <span>
                Order {formatId(orderData.id)} placed by:{" "}
                <strong>{orderData?.creator.name}</strong>
              </span>
              <span>{format(tableData.createdAt, "dd MMM yyyy HH:mm")}</span>
            </>
          )}
        </DialogHeader>
        {tableData.status === "occupied" ? (
          orderData && orderData !== "null" && <TableDetails data={orderData} />
        ) : (
          <EmptyTable
            tableId={tableData.id}
            tableNumber={tableData.number}
            clean={!tableData.requireCleaning}
          />
        )}

        <DialogFooter className="flex justify-between">
          {orderData &&
            orderData !== "null" &&
            tableData.status === "occupied" && (
              <ActionButtons
                isPaid={orderData.isPaid}
                orderId={orderData.id}
                status={orderData.status}
              />
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
// return (
//   <Drawer>
//     <DrawerTrigger>
//       {/* <TableButton tableData={tableData} /> */}
//     </DrawerTrigger>
//     <DrawerContent>
//       {tableData.status === "occupied" ? (
//         data && <TableDetails data={data} />
//       ) : (
//         <EmptyTable
//           tableId={tableData.id}
//           clean={!tableData.requireCleaning}
//           tableNumber={tableData.number}
//         />
//       )}
//       <DrawerFooter>
//         {/* {orderData?.id && (
//           <ActionButtons
//             isPaid={orderData?.isPaid}
//             orderId={orderData?.id}
//             status={orderData?.status}
//             totalAmount={totalAmount}
//           />
//         )} */}
//         <DrawerClose asChild>
//           <Button variant="outline" className="border/40">
//             Close
//           </Button>
//         </DrawerClose>
//       </DrawerFooter>
//     </DrawerContent>
//   </Drawer>
// );
