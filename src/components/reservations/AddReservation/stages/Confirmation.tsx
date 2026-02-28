import { Button } from "@/components/ui/button";
import { type ReservationStepsProps } from "../ReservationSteps";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatFieldName } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Confirmation({ form, isPending }: ReservationStepsProps) {
  const fieldsName = [
    "customerName",
    "customerEmail",
    "customerPhoneNumber",
    "guestsPredictedNumber",
    "tableId",
    "specialRequests",
    "notes",
    "scheduledAt",
    "expireAt",
  ] as const;

  const fields = fieldsName.map((field) => {
    const value = form.getValues(field);
    if (!value) return null;
    return (
      <div key={field} className="min-w-0 flex-auto gap-4">
        <p className="mt-1 truncate text-xs capitalize leading-5 text-gray-500">
          {formatFieldName(field)}
        </p>
        <p className="text-sm font-semibold leading-6 text-gray-900">{value}</p>
      </div>
    );
  });

  return (
    <ScrollArea className="max-h-[60vh]">
      <div>
        <div className="flex flex-col pb-2 pt-2">
          <h1 className="mb-5 text-center font-semibold">
            Reservation Confirmation
          </h1>
          {fields}
        </div>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Reservation"
          )}
        </Button>
      </div>
    </ScrollArea>
  );
}
