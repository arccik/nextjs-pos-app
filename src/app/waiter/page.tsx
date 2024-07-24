"use client";
// import Orders from "@/components/pages/orders/OrdersList";
import { Button } from "@/components/ui/button";

import {
  User2Icon,
  CheckCircle,
  ShoppingBasket,
  TableIcon,
} from "lucide-react";
import SelectTableDialog from "./SelectTable";
import { useSearchParams } from "next/navigation";
// import TableIcon from "@/components/layout/navigation/TableIcon";
// import TablesCards from "@/components/tables/TableCards";
// import { useSearchParams } from "next/navigation";

export default function Waiter() {
  // const searchParams = useSearchParams();
  // const params = new URLSearchParams(searchParams.toString());

  // const selectedTab = params.get("tab");
  // const userId = 1;

  // const handleTabClick = (value: string) => {
  //   params.set("tab", value);
  // };

  return (
    <main className="space-y-5 p-4">
      {/* <p className="text-sm">
        Welcome back <b>user {userId}</b>
      </p> */}

      <div className="grid grid-cols-2 place-content-center items-center justify-center gap-4 md:grid-cols-4">
        <SelectTableDialog
          buttonTrigger={
            <Button className="h-24" size="lg" variant="outline">
              <div className="flex flex-col items-center gap-1">
                <User2Icon className="h-6 w-6" />
                <span className="text-sm font-medium leading-none">New</span>
              </div>
            </Button>
          }
        />
        <Button
          // onClick={() => handleTabClick("orders")}
          className="h-24"
          size="lg"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-1">
            <ShoppingBasket className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">Orders</span>
          </div>
        </Button>
        <Button
          // onClick={() => handleTabClick("completedOrders")}
          className="h-24"
          size="lg"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-1">
            <CheckCircle className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">
              Completed Orders
            </span>
          </div>
        </Button>
        <Button
          // onClick={() => handleTabClick("tables")}
          className="h-24"
          size="lg"
          variant="outline"
        >
          <div className="flex flex-col items-center gap-1">
            <TableIcon className="h-6 w-6" />
            <span className="text-sm font-medium leading-none">Tables</span>
          </div>
        </Button>
      </div>
      {/* {selectedTab == "orders" && <Orders orderStatus="In Progress" />}
      {selectedTab == "completedOrders" && <Orders orderStatus="Completed" />}
      {selectedTab == "tables" && <TablesCards standalone />} */}
    </main>
  );
}
