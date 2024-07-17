"use client";

import { DataTable } from "@/components/DataTable";
import { columns } from "./ItemColumns";
import { api } from "@/trpc/react";
import AddNewCategoryButton from "@/app/menu/category/AddNewCategoryButton";
import AddNewItemButton from "./AddNewItemButton";

export default function Items() {
  const { data, refetch } = api.item.getAll.useQuery();
  return (
    <main className="p-2 md:container md:mt-10 ">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">Menu Items</h1>
        </div>
        <div className="flex gap-4">
          <AddNewCategoryButton />
          <AddNewItemButton refetch={refetch} />
        </div>
      </div>
      {!!data ? (
        <DataTable data={data} columns={columns} searchField="name" />
      ) : (
        <p>No items was found.</p>
      )}
    </main>
  );
}
