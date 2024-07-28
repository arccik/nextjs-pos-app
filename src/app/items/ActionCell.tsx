"use client";
import type { Item } from "@/server/db/schemas";
import { CellContext } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
// import {
//   addItemToStopList,
//   deleteOne,
//   removeItemFromStopList,
// } from "@/api/items";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function ActionCell(props: CellContext<Item, unknown>) {
  const router = useRouter();
  const rowId = props.row.original.id;
  //   const addToStopList = useMutation({
  //     mutationFn: addItemToStopList,
  //     onSuccess: () => {
  //       console.log("Item added to stop list");
  //       queryClient.invalidateQueries({ queryKey: ["items"] });
  //     },
  //   });
  //   const removeFromStopList = useMutation({
  //     mutationFn: removeItemFromStopList,
  //     onSuccess: () => {
  //       console.log("Item removed from stop list");
  //       queryClient.invalidateQueries({ queryKey: ["items"] });
  //     },
  //   });

  const handleAddItemToStopList = (itemId: string) => {
    // addToStopList.mutate(itemId);
    throw new Error("Not implemented");
  };
  const handleRemoveItemFromStopList = (itemId: string) => {
    // removeFromStopList.mutate(itemId!);
    throw new Error("Not implemented");
  };
  //   const deleteItem = useMutation({
  //     mutationFn: deleteOne,
  //     onSuccess: () => {
  //       toast({
  //         title: "Success",
  //         description: "Item deleted successfully",
  //       });
  //       queryClient.invalidateQueries({ queryKey: ["items"] });
  //     },
  //     onError: (error) => {
  //       console.error("Action Cell", error);
  //       toast({
  //         title: "Error",
  //         description: "Item not deleted",
  //         variant: "destructive",
  //       });
  //     },
  //   });

  const handleDelete = () => {
    // deleteItem.mutate(String(rowId));
    throw new Error("Not implemented");
  };
  // return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>View item</DropdownMenuItem>
          <DropdownMenuItem>View nutritions</DropdownMenuItem>

          {props.row.original.isAvailable ? (
            <DropdownMenuItem onClick={() => handleAddItemToStopList(rowId)}>
              Disable
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => handleRemoveItemFromStopList(rowId)}
            >
              Enable
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="text-yellow-500 "
            onClick={() => router.push(`/menu/items/edit?id=${rowId}`)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 " onClick={handleDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
