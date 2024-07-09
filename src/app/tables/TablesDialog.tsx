// import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import Error from "@/components/layout/Error";
// import { getOneByTableId } from "@/api/orders";
import { getOneByTableId, type OrderWithItems } from "@/server/db/models/order";

import TableDetails from "./TableDetails";
import TableButton from "./TableButton";
// import useMediaQuery from "@/hooks/useMediaQuery";
// import ActionButtons from "../pages/orders/ActionButtons";
import EmptyTable from "./Emptytable";
// import { summarizePrice } from "@/lib/utils";
import { format } from "date-fns";
import { type TableWithReservation } from "@/server/db/schemas";

export default async function TableDialog({
  tableData,
}: {
  tableData: TableWithReservation;
}) {
  // const isDesktop = useMediaQuery();
  // const { data: orderData, isError } = useQuery<OrderWithItems>({
  //   queryKey: ["table", tableData.id],
  //   queryFn: () => getOneByTableId(tableData.id),
  // });
  const orderData = await getOneByTableId(tableData.id);
  const isDesktop = true;
  // if (isError) return <Error message="wan't able to fetch table data" />;

  // const totalAmount = Number(
  //   orderData?.orderItems && summarizePrice(orderData.orderItems)?.toFixed(2),
  // );
  if (!tableData && !orderData) return null;
  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger>
          <TableButton tableData={tableData} />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between">
              Table #{tableData.number}
            </DialogTitle>
            {orderData?.userId && tableData.createdAt && (
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
            {/* {orderData?.id && tableData.status === "occupied" && (
              <ActionButtons
                isPaid={orderData?.isPaid}
                orderId={orderData?.id}
                status={orderData?.status}
                tableId={tableData.id}
                totalAmount={totalAmount}
              />
            )} */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer>
      <DrawerTrigger>
        <TableButton tableData={tableData} />
      </DrawerTrigger>
      <DrawerContent>
        {tableData.status === "occupied" ? (
          orderData && <TableDetails data={orderData} />
        ) : (
          <EmptyTable
            tableId={tableData.id}
            clean={!tableData.requireCleaning}
            tableNumber={tableData.number}
          />
        )}
        <DrawerFooter>
          {/* {orderData?.id && (
            <ActionButtons
              isPaid={orderData?.isPaid}
              orderId={orderData?.id}
              status={orderData?.status}
              totalAmount={totalAmount}
            />
          )} */}
          <DrawerClose asChild>
            <Button variant="outline" className="border/40">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
