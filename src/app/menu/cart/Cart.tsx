"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { CloseCartDialog } from "./CloseCartDialog";
import CartItems from "./CartItems";

import TableIcon from "@/components/navbar/TableIcon";
import { ClockIcon, Edit2, Utensils } from "lucide-react";
import AddOrderSpecialRequest from "./AddOrderSpecialRequest";
import SelectTable from "@/app/waiter/SelectTable";
import { type SelectedTable } from "@/app/waiter/ChooseTable";
import Loading from "@/components/Loading";
import useOrder from "@/hooks/useOrder";

type CartProps = {
  selectedTable?: SelectedTable;
};

export default function Cart() {
  // const { data: order } = api.order.getSelectedByUser.useQuery();
  const { selectedOrder, update } = useOrder();

  console.log("USE ORDER HOOK: ", { selectedOrder });

  // const update = api.order.updateOrder.useMutation({
  //   onSuccess: (res) => {
  //     console.log("SUCCESS !!! ", res);
  //   },
  //   onError: (err) => {
  //     console.log("ERROR !!! ", err);
  //   },
  // });

  const items = selectedOrder?.orderItems;

  const handleSubmitOrder = () => {
    console.log("submitting order", selectedOrder);
    // update.mutate({
    //   id: orderId,
    //   body: {
    //     tableId: selectedTable?.id,
    //     userId: data?.userId!,
    //     status: "In Progress",
    //   },
    // });
  };
  if (!selectedOrder) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Utensils size="1rem" className="mr-2" />
          Order #{selectedOrder?.id.slice(-9)}
        </CardTitle>
        <AddOrderSpecialRequest
          orderId={selectedOrder.id}
          request={selectedOrder.specialRequest}
        />
      </CardHeader>
      <CardContent className="grid gap-4">
        {selectedOrder.tableId ? (
          <div className="flex items-center gap-4">
            <ClockIcon className="h-6 w-6" />
            <div className="grid gap-1 text-sm">
              <div className="flex items-center gap-2">
                <p className="font-semibold">
                  Table #{selectedOrder.table?.number}
                </p>
                <SelectTable buttonTrigger={<Edit2 size="1rem" />} />
              </div>
              {true && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Special requests: {true}
                </p>
              )}
            </div>
          </div>
        ) : (
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

        {items && <CartItems items={selectedOrder.orderItems} />}
      </CardContent>
      <CardFooter className="flex flex-col justify-center gap-4 p-4">
        <div className="flex w-full gap-5">
          <CloseCartDialog orderId={selectedOrder.id} />
          <Button
            onClick={handleSubmitOrder}
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
