"use client";
import type { Item } from "@/server/db/schemas";
import { type CellContext } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

export default function ActionCell(props: CellContext<Item, unknown>) {
  const router = useRouter();
  const utils = api.useUtils();
  const row = props.row.original;

  const deleteItem = api.item.delete.useMutation({
    onSuccess: () => {
      void utils.item.getAll.invalidate();
      toast({ title: "Item deleted" });
    },
    onError: (err) => {
      toast({
        title: "Failed to delete item",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const toggleAvailability = api.item.update.useMutation({
    onSuccess: () => {
      void utils.item.getAll.invalidate();
      toast({
        title: row.isAvailable ? "Item disabled" : "Item enabled",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to update item",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          className="text-yellow-600"
          onClick={() => router.push(`/items/${row.id}`)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            toggleAvailability.mutate({ ...row, isAvailable: !row.isAvailable })
          }
          disabled={toggleAvailability.isPending}
        >
          {row.isAvailable ? "Disable" : "Enable"}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => deleteItem.mutate({ id: row.id })}
          disabled={deleteItem.isPending}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
