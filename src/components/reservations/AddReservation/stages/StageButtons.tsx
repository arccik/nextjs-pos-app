import { Button } from "@/components/ui/button";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { type NewReservation } from "@/server/db/schemas";
import { UseFormReturn } from "react-hook-form";

type StageButtonsProps = {
  setSelectedTab: (value: string) => void;
  selectedTab: string;
  form: UseFormReturn<NewReservation>;
};
export default function StageButtons({
  selectedTab,
  setSelectedTab,
  form,
}: StageButtonsProps) {
  const handleNextClick = async () => {
    const nextTab = (Number(selectedTab) + 1)?.toString();

    if (selectedTab === "1") {
      const isFieldsValid = await form.trigger(["scheduledAt", "expireAt"]);
      if (isFieldsValid) {
        setSelectedTab(nextTab);
      }
      return;
    }
    if (selectedTab === "2") {
      const isFieldsValid = await form.trigger([
        "customerName",
        "customerPhoneNumber",
        "customerEmail",
        "guestsPredictedNumber",
        "specialRequests",
        "notes",
      ]);
      if (isFieldsValid) {
        setSelectedTab(nextTab);
      }
      return;
    }
  };
  return (
    <div className="mt-5 flex gap-4">
      {selectedTab !== "1" && (
        <Button
          onClick={() => setSelectedTab((Number(selectedTab) - 1)?.toString())}
          variant="outline"
          className="w-full"
          type="button"
        >
          <ArrowBigLeft />
          Back
        </Button>
      )}
      {selectedTab !== "3" && (
        <Button
          onClick={() => handleNextClick()}
          variant="outline"
          className="w-full"
          type="button"
        >
          Next <ArrowBigRight />
        </Button>
      )}
    </div>
  );
}
