import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import AddReservation from "@/components/reservations/addReservation/AddReservation";
import AddTable from "./AddTable";

export function AdminMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVerticalIcon className="cursor-pointer rounded-md border p-1 hover:bg-gray-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <AddReservation />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <AddTable />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
