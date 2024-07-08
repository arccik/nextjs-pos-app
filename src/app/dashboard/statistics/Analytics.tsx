import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon, LineChart } from "lucide-react";
export default function Analytics() {
  return null;
  return (
    <div className="bg-white dark:bg-gray-950 rounded-lg shadow-md p-6 col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium">Statistics</div>
        <Button size="icon" variant="outline">
          <LineChart className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </Button>
      </div>
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-500 dark:text-gray-400">Revenue</div>
          <div className="flex items-center gap-2">
            <div className="font-medium">£45,231</div>
            <ArrowUpIcon className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-500 dark:text-gray-400">
            Conversion Rate
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">12.5%</div>
            <ArrowDownIcon className="w-5 h-5 text-red-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-500 dark:text-gray-400">Bounce Rate</div>
          <div className="flex items-center gap-2">
            <div className="font-medium">32.1%</div>
            <ArrowUpIcon className="w-5 h-5 text-green-500" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-gray-500 dark:text-gray-400">
            Avg. Order Value
          </div>
          <div className="flex items-center gap-2">
            <div className="font-medium">£75</div>
            <ArrowDownIcon className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
