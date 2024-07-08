import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type NewReservation } from "@server/src/schemas";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";
import ReservationInfo from "./stages/ReservationInfo";
import CustomerInfo from "./stages/CustomerInfo";
import Confirmation from "./stages/Confirmation";
import StageButtons from "./stages/StageButtons";

export type ReservationStepsProps = {
  form: UseFormReturn<NewReservation>;
};

export default function ReservationSteps({ form }: ReservationStepsProps) {
  const [selectedTab, setSelectedTab] = useState("1");
  return (
    <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      <TabsList className="flex justify-center bg-white">
        <TabsTrigger value="1" disabled>
          Reservation
        </TabsTrigger>
        <TabsTrigger value="2" disabled>
          Customer Info
        </TabsTrigger>
        <TabsTrigger value="3" disabled>
          Confirmation
        </TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        <ReservationInfo form={form} />
      </TabsContent>
      <TabsContent value="2">
        <CustomerInfo form={form} />
      </TabsContent>
      <TabsContent value="3">
        <Confirmation form={form} />
      </TabsContent>
      <StageButtons setSelectedTab={setSelectedTab} selectedTab={selectedTab} form={form} />
    </Tabs>
  );
}