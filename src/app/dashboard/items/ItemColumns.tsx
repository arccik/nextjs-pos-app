"use client";
import { ColumnDef } from "@tanstack/react-table";
import type { Item } from "@/server/db/schemas/item";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

import { useQuery } from "@tanstack/react-query";
// import { getOne } from "@/api/categories";
import ActionCell from "./ActionCell";
import { api } from "@/trpc/react";

// export const columns = itemFields.map((field): ColumnDef<Item> => {
//   return {
//     accessorKey: field,
//     header: field,
//     cell: ({ row }) => {
//       return <div className="capitalize">{row.getValue(field) + ""}</div>;
//     },
//   };
// });

export const columns: ColumnDef<Item>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 capitalize">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 capitalize">{row.getValue("price")}</div>
    ),
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">
        <img width={100} src={row.getValue("imageUrl")} />
      </div>
    ),
  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const categoryId: number = row.getValue("categoryId");
      const { data } = useQuery({
        queryKey: ["category", categoryId],
        queryFn: () => {
          const { data } = api.category.getOne.useQuery({ id: categoryId });
          return data;
        },
      });
      return <div className="ml-4 lowercase">{data?.name}</div>;
    },
  },
  {
    accessorKey: "isVegetarian",
    header: "Vegetarian",
    cell: ({ row }) => (
      <div className="ml-5">
        {row.getValue("isVegetarian") ? (
          <CheckIcon className="size-7 text-green-500" />
        ) : (
          <Cross2Icon className="size-5 text-destructive" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "isVegan",
    header: "Vegan",
    cell: ({ row }) => (
      <div className="ml-2">
        {row.getValue("isVegan") ? (
          <CheckIcon className="size-7 text-green-500" />
        ) : (
          <Cross2Icon className="size-5 text-destructive" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "isGlutenFree",
    header: "Gluten Free",
    cell: ({ row }) => (
      <div className="ml-5">
        {row.getValue("isGlutenFree") ? (
          <CheckIcon className="size-7 text-green-500" />
        ) : (
          <Cross2Icon className="size-5 text-destructive" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "isSpicy",
    header: "Spicy",
    cell: ({ row }) => (
      <div className="ml-2">
        {row.getValue("isSpicy") ? (
          <CheckIcon className="size-7 text-green-500" />
        ) : (
          <Cross2Icon className="size-5 text-destructive" />
        )}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: (props) => <ActionCell {...props} />,
  },
];
