// import { useQuery } from "@tanstack/react-query";
import { Vegan } from "lucide-react";

export default function TopSalesItems() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["top-sales-items"],
  //     queryFn: () =>
  //       fetch("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").then((res) => res.json()),
  //   });

  return (
    <div className="col-span-2  grid grid-cols-2 gap-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-950">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
          <Vegan className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Pad Thai</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            120 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
          <Vegan className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Margherita Pizza</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            90 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
          <Vegan className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Pasta</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            80 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
          <Vegan className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Beef Burger</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            60 sold
          </div>
        </div>
      </div>
    </div>
  );
}
