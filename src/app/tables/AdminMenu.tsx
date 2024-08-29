import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import AddReservation from "@/components/reservations/AddReservation/AddReservation";
import AddTable from "./AddTable";
import { useState } from "react";

export function AdminMenu() {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <EllipsisVerticalIcon className="cursor-pointer rounded-md border p-1 hover:bg-gray-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AddReservation open={true} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AddTable />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
