"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { DataTable } from "@/components/DataTable";

import AddItem from "./form/AddItem";
import { columns } from "./ItemColumns";
import { api } from "@/trpc/react";
// import { revalidatePath } from "next/cache";

export default function Items() {
  const { data, refetch } = api.item.getAll.useQuery();
  return (
    <main className="p-2 md:container md:mt-10 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
        </div>
        <Dialog onOpenChange={() => refetch()}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent className="h-[calc(100%-2rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Item</DialogTitle>
              <DialogDescription>
                Here you can add new items to the menu
              </DialogDescription>
            </DialogHeader>
            <AddItem
              onClose={() => {
                refetch();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      {!!data ? (
        <DataTable data={data} columns={columns} searchField="name" />
      ) : (
        <p>No items was found.</p>
      )}
    </main>
  );
}
