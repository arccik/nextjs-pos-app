// import { useStore } from "@/store";
"use client";
import { Button } from "@/components/ui/button";
import { type Item } from "@/server/db/schemas/item";
import { useToast } from "@/components/ui/use-toast";
import { PlusIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
// import { Separator } from "@/components/ui/separator";

type MenuItemProps = {
  item: Item;
};

export default function MenuItem({ item }: MenuItemProps) {
  const { toast } = useToast();
  //   const { addItem } = useStore();

  const handleClick = () => {
    // addItem(item);
    console.log("Add items to order: Status take");

    toast({
      title: `${item.name} added to selected order`,
    });
  };
  return (
    <div className="grid grid-flow-col items-start gap-3">
      {item.imageUrl && (
        <div className="flex h-full items-center">
          <img
            alt={item.name ?? "Item Image"}
            className="aspect-[2/4] h-32 w-full rounded-lg object-cover"
            src={item.imageUrl}
          />
        </div>
      )}
      <div className="flex flex-col place-content-end justify-between">
        <h3
          className={cn(
            "flex gap-2 text-xl font-semibold",
            !item.isAvailable && " text-red-400",
          )}
        >
          {!item.isAvailable && <ExclamationTriangleIcon className="size-6" />}
          {item.name}
        </h3>
        <p className="text-sm leading-none">{item.description}</p>
        <div className="flex place-content-end items-end justify-between">
          <span className="font-semibold">{formatCurrency(item.price)}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={!item.isAvailable}
          >
            <PlusIcon size="1rem" className="mr-1" /> Add to Order
          </Button>
        </div>
      </div>
      {/* <Separator className="mt-10" /> */}
    </div>
  );
}
