import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { addItemToStopList, getAll, removeItemFromStopList } from "@/api/items";
// import type { Item } from "@server/src/schemas";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";

export default async function StopList() {
  // const [selectedItem, setSelectedItem] = useState<undefined | string>();
  const data = await db.query.items.findMany({
    where: (items) => eq(items.isAvailable, false),
  });
  // const queryClient = useQueryClient();

  // const { data, isLoading, isError } = useQuery<Item[]>({
  //   queryKey: ["items"],
  //   queryFn: getAll,
  // });
  // const addToStopList = useMutation({
  //   mutationFn: addItemToStopList,
  //   onSuccess: () => {
  //     console.log("Item added to stop list");
  //     queryClient.invalidateQueries({ queryKey: ["items"] });
  //   },
  // });
  // const removeFromStopList = useMutation({
  //   mutationFn: removeItemFromStopList,
  //   onSuccess: () => {
  //     console.log("Item removed from stop list");
  //     queryClient.invalidateQueries({ queryKey: ["items"] });
  //   },
  // });

  // const handleAddItemToStopList = (itemId: string) => {
  //   console.log("Add item to stop list:", itemId);
  //   const id = parseInt(itemId);
  //   if (isNaN(id)) return;
  //   // addToStopList.mutate(id);
  //   // setSelectedItem(undefined);
  // };
  const handleRemoveItemFromStopList = (itemId: string) => {
    itemId;
    // removeFromStopList.mutate(itemId!);
  };
  return (
    <div className="grid gap-3">
      <div className="font-semibold text-red-400">Stop Menu</div>
      <dl>
        <p className="text-muted-foreground">
          Running out of stuff ? <br /> Add item to stop list
        </p>
      </dl>
      <div className="flex gap-2">
        {/* <Select onValueChange={setSelectedItem} defaultValue={selectedItem}> */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a item" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Stop Items</SelectLabel>
              {/* {isLoading && <SelectItem value="Loading">Loading...</SelectItem>} */}
              {/* {isError && <SelectItem value="Error">Error</SelectItem>} */}
              {!!data &&
                data.map((item) => {
                  if (item.isAvailable) {
                    return (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        {item.name}
                      </SelectItem>
                    );
                  }
                })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          // onClick={() => handleAddItemToStopList(selectedItem!)}
          variant="outline"
          size="icon"
          // disabled={!selectedItem}
        >
          Add
        </Button>
      </div>
      {data?.map((item) => {
        if (!item.isAvailable) {
          return (
            <div
              key={item.id}
              className="flex w-full justify-between rounded-md border border-red-400 p-2 text-red-400"
            >
              <p>{item.name}</p>
              <XIcon
                onClick={() => handleRemoveItemFromStopList(item.id)}
                className="h-4 w-4 cursor-pointer hover:scale-105 hover:text-slate-800"
              />
            </div>
          );
        }
      })}
    </div>
  );
}
