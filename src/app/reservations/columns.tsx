import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import type { Reservation } from "@/server/db/schemas";

export const reservationColumns: ColumnDef<Reservation>[] = [
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
    accessorKey: "customerName",
    header: () => <p className="text-xs">Customer Name</p>,
    cell: ({ row }) => (
      <div className="ml-4 lowercase">{row.getValue("customerName")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 capitalize">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "tableId",
    header: "TableID",
    cell: ({ row }) => <div>{row.getValue("tableId")}</div>,
  },
  {
    accessorKey: "scheduledAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="ml-4 capitalize">{row.getValue("scheduledAt")}</div>
    ),
  },
  {
    accessorKey: "expireAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          expireAt
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 capitalize">{row.getValue("expireAt")}</div>
    ),
  },
  {
    accessorKey: "guestsPredictedNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Guests Number
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="ml-4 lowercase">
        {row.getValue("guestsPredictedNumber")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">{row.getValue("status")}</div>
    ),
  },

  {
    accessorKey: "customerPhoneNumber",
    header: "Phone number",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">
        {row.getValue("customerPhoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "customerEmail",
    header: "Customer Email",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">{row.getValue("customerEmail")}</div>
    ),
  },
  {
    accessorKey: "specialRequests",
    header: "Special Request",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">{row.getValue("specialRequests")}</div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Staff Notes",
    cell: ({ row }) => (
      <div className="ml-4 lowercase">{row.getValue("notes")}</div>
    ),
  },
];
