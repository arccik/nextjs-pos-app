// import { useQuery } from "@tanstack/react-query";
import { PocketIcon, ShirtIcon, ShoppingBagIcon, Vegan } from "lucide-react";

export default function TopSalesItems() {
  //   const { data, isLoading, isError } = useQuery({
  //     queryKey: ["top-sales-items"],
  //     queryFn: () =>
  //       fetch("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX").then((res) => res.json()),
  //   });
  return (
    <div className="bg-white  col-span-2 dark:bg-gray-950 rounded-lg shadow-md p-6 grid grid-cols-2 gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <Vegan className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Pad Thai</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            120 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <Vegan className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Margherita Pizza</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            90 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <Vegan className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Pasta</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            80 sold
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-2">
          <Vegan className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          <div className="font-medium">Beef Burger</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            60 sold
          </div>
        </div>
      </div>
    </div>
  );
}
