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
    <div className="relative mb-8 grid grid-cols-4 gap-4">
      {item.imageUrl && (
        <div className="col-span-1">
          <Image
            width="128"
            height="128"
            alt={item.name ?? "Item Image"}
            className="aspect-[2/4] rounded-lg object-cover"
            src={item.imageUrl}
          />
        </div>
      )}
      <div className="col-span-3 ">
        <h3
          className={cn(
            "flex gap-2 text-xl font-semibold",
            !item.isAvailable && " text-red-400",
          )}
        >
          {!item.isAvailable && <ExclamationTriangleIcon className="size-6" />}
          {item.name}
        </h3>
        <p className="text-sm leading-none text-gray-500">{item.description}</p>
        <div className="absolute bottom-0 right-0">
          <AddItemToOrderButton item={item} />
        </div>
        <span className="font-semibold">{formatCurrency(item.price)}</span>
      </div>
    </div>
  );
}
