"use client";
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
import { toast } from "@/components/ui/use-toast";
import useOrder from "@/hooks/useOrder";
import { api } from "@/trpc/react";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
// import { useStore } from "@/store";

export function CloseCartDialog({
  orderId,
  tableId,
}: {
  orderId?: string;
  tableId?: string;
}) {
  const router = useRouter();
  const { deleteOne } = useOrder();
  //   const { setSelectedTable, resetItems, addSpecialRequest } = useStore();
  const unselectTable = api.table.unselectTable.useMutation({
    onSuccess: () => toast({ title: "Table Unselected" }),
  });

  const handleCloseDialog = () => {
    console.log("handleCloseDialog", { orderId, tableId });
    if (orderId) {
      deleteOne(orderId);
    }
    // deleteOrder.mutate({ id: orderId });
    // unselectTable.mutate({ tableId });
    router.refresh();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="w-full hover:border-red-500" variant="outline">
          Cancel
          <Cross1Icon className="ml-2" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the order
            and remove selected data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCloseDialog}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
