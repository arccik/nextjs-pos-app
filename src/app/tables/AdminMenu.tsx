import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { api } from "@/trpc/react";

import { useState } from "react";

type AdminMenuProps = {
  tableId: string;
};

export function AdminMenu({ tableId }: AdminMenuProps) {
  const utils = api.useUtils();
  const makeAvailable = api.table.changeStatus.useMutation({
    onSuccess: async () => await utils.table.invalidate(),
  });
  const makeClean = api.table.markClean.useMutation({
    onSuccess: async () => await utils.table.invalidate(),
  });
  const [open, setOpen] = useState(false);

  const handleStatusChange = () => {
    makeAvailable.mutate({ tableId, status: "available" });
  };

  const handleCleaningStatusChange = () => {
    makeClean.mutate(tableId);
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <EllipsisVerticalIcon className="cursor-pointer rounded-md border p-1 hover:bg-gray-100" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Change table status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleStatusChange}>
          Make Available
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCleaningStatusChange}>
          Mark as clean
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
