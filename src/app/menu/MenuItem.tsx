import { type Item } from "@/server/db/schemas/item";
import { cn, formatCurrency } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import AddItemToOrderButton from "./AddItemToOrderButton";
import Image from "next/image";

type MenuItemProps = {
  item: Item;
};

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <div className="flex gap-3">
      {item.imageUrl && (
        <div className="shrink-0">
          <Image
            width={80}
            height={80}
            alt={item.name ?? "Item Image"}
            className="h-20 w-20 rounded-lg object-cover"
            src={item.imageUrl}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* Name */}
        <h3
          className={cn(
            "flex items-center gap-1.5 text-base font-semibold leading-snug",
            !item.isAvailable && "text-red-400",
          )}
        >
          {!item.isAvailable && <ExclamationTriangleIcon className="size-4 shrink-0" />}
          {item.name}
        </h3>

        {/* Description — capped at 2 lines so it never bleeds into the action row */}
        {item.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        )}

        {/* Price + add button always below the description */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="font-semibold">{formatCurrency(item.price)}</span>
          <AddItemToOrderButton item={item} />
        </div>
      </div>
    </div>
  );
}
