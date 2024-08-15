"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { CloseCartDialog } from "./CloseCartDialog";
import CartItems from "./CartItems";
import SelectTable from "./SelectedTable";

import TableIcon from "@/components/navbar/TableIcon";
import { ClockIcon, Edit2, Utensils } from "lucide-react";
import { useSearchParams } from "next/navigation";
import AddOrderSpecialRequest from "./AddOrderSpecialRequest";
import { useContext } from "react";
import { api } from "@/trpc/react";
import useLocalStorage from "@/hooks/useLocalStorage";

type CartProps = {
  onComplete?: () => void;
};
export default function Cart({ onComplete }: CartProps) {


  const [orderId, setOrderId] = useLocalStorage<string | undefined>(
    "orderId",
    undefined,
  );

  console.log(
    "CARD << ACTIVE ORDER : !! ! !{ } }} {{ } }{ {{{ { {{ { { { { { {",
    orderId,
  );

  const { data } = api.order.getOrderWithItems.useQuery(
    { id: orderId! },
    { enabled: !!orderId },
  );
  const items = data?.orderItems;
  console.log("CARD << ACTIVE ORDER : ", orderId);

  const selectedTable = "test";
  const specialRequest = "TEST - special request: jaica";

  if (!orderId) return null;

  //   if (selectedTable && !items.length) {
  //     return (
  //       <AlertDialog>
  //         <Card>
  //           <CardContent className=" mt-auto flex items-center gap-2 border-none text-base">
  //             <TableIcon className="size-8 dark:text-gray-400" />
  //             <CardTitle className="mt-auto text-base">{`Table  ${selectedTable.number || selectedTable.tableId} selected `}</CardTitle>
  //             <AlertDialogTrigger asChild>
  //               <Button className="ml-auto bg-red-500" size="icon">
  //                 <Trash2Icon className="size-4" />
  //               </Button>
  //             </AlertDialogTrigger>
  //           </CardContent>
  //         </Card>

  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>Confirm table removal?</AlertDialogTitle>
  //             <AlertDialogDescription>
  //               This action cannot be undone.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel>Cancel</AlertDialogCancel>
  //             <AlertDialogAction onClick={() => setSelectedTable(null)}>
  //               Continue
  //             </AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   }

  return (
    <Card className="max-w-full">
      <CardHeader>
        {orderId && (
          <>
            <CardTitle className="flex items-center">
              <Utensils size="1rem" className="mr-2" />
              Order #{orderId.slice(-9)}
            </CardTitle>
            {/* <AddOrderSpecialRequest orderId={activeOrderId} /> */}
          </>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {!selectedTable && (
          <div className="flex items-center gap-4">
            <ClockIcon className="h-6 w-6" />
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <p className="font-semibold">Table #{selectedTable}</p>
                <SelectTable buttonTrigger={<Edit2 size="1rem" />} />
              </div>
              {specialRequest && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Special requests: {specialRequest}
                </p>
              )}
            </div>
          </div>
        )}

        {!selectedTable && (
          <SelectTable
            buttonTrigger={
              <Button
                size="sm"
                className="items-center font-semibold"
                variant="link"
              >
                <TableIcon className="mr-2 size-5" /> Select table
              </Button>
            }
          />
        )}

        {items && <CartItems items={items} />}
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-4 p-4">
        {/* <AddSpecialRequest orderId={activeOrder} /> */}
        <div className="flex w-full gap-5">
          <CloseCartDialog orderId={orderId} tableId={selectedTable} />
          <Button
            // onClick={handleSubmitOrder}
            // disabled={saveOrder.isPending || addMoreItemsToOrder.isPending}
            className="w-full"
          >
            Proceed
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
