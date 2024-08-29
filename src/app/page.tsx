import SummaryCard from "./(dashboard)/SummaryCard";
import OrderTable from "./(dashboard)/OrderTable";
import VenueDetails from "./(dashboard)/VenueDetails";
import TopSection from "./(dashboard)/TopSection";
import { Suspense } from "react";
import Loading from "@/components/Loading";

export default function Dashboard() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <div className="flex sm:gap-2 sm:py-4">
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <TopSection />
            <Suspense fallback={<Loading />}>
              <SummaryCard />
              <OrderTable />
            </Suspense>
          </div>
          <div>
            <VenueDetails />
          </div>
        </div>
      </div>
    </main>
  );
}
