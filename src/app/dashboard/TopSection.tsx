import SalesToday from "./statistics/SalesToday";
import TotalCustomers from "./statistics/TotalCustomers";
import TopSalesItems from "./statistics/TopSalesItems";
import Analytics from "./statistics/Analytics";

export default function TopSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-8">
      <SalesToday />
      <TotalCustomers />
      <TopSalesItems />
      <Analytics />
    </div>
  );
}
