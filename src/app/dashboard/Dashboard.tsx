import SummaryCard from "./SummaryCard";
import OrderTable from "./OrderTable";
import VenueDetails from "./VenueDetails";
import TopSection from "./TopSection";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex sm:gap-2 sm:py-4 sm:pl-14">
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8 lg:col-span-2">
            <TopSection />
            <SummaryCard />
            <OrderTable />
          </div>
          <div>
            <VenueDetails />
          </div>
        </div>
      </div>
    </main>
  );
}
