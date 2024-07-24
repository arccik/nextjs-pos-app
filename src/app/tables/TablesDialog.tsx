"use client";
// import { Button } from "@/components/ui/button";
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
// import useMediaQuery from "@/hooks/useMediaQuery";
import EmptyTable from "./Emptytable";
// import { summarizePrice } from "@/lib/utils";
import { format } from "date-fns";
import { type TableWithReservation } from "@/server/db/schemas";
import { api } from "@/trpc/react";
import ActionButtons from "@/components/ActionButtons";
import Loading from "@/components/Loading";

type TableDIalogProps = {
  tableData: TableWithReservation;
};

export default function TableDialog({ tableData }: TableDIalogProps) {
  const { data: orderData, isLoading } = api.order.getOneByTableId.useQuery(
    {
      tableId: tableData.id,
    },
    {
      enabled: tableData.status === "occupied",
      refetchOnWindowFocus: false,
    },
  );
  if (isLoading) return <Loading />;
  return (
    <Dialog>
      <DialogTrigger>
        <TableButton tableData={tableData} />
      </DialogTrigger>
      <DialogContent title={`Table #${tableData.number}`}>
        <DialogHeader>
          <DialogTitle className="flex justify-between">
            Table #{tableData.prefix}
            {tableData.number}
          </DialogTitle>
          {tableData.description}
          {orderData?.userId && (
            <DialogDescription className="flex justify-between">
              <span>
                Order {orderData.id} placed by user: {orderData?.userId}
              </span>
              <span>{format(tableData.createdAt, "dd MMM yyyy HH:mm")}</span>
            </DialogDescription>
          )}
        </DialogHeader>
        {tableData.status === "occupied" ? (
          orderData && <TableDetails data={orderData} />
        ) : (
          <EmptyTable
            tableId={tableData.id}
            tableNumber={tableData.number}
            clean={!tableData.requireCleaning}
          />
        )}

        <DialogFooter className="flex justify-between">
          {orderData && tableData.status === "occupied" && (
            <ActionButtons
              isPaid={orderData.isPaid}
              orderId={orderData.id}
              status={orderData.status}
              tableId={tableData.id}
              totalAmount={orderData.bill?.totalAmount!}
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
