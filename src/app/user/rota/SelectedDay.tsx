"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StaffStatusSelector } from "./StaffSelection";
import { format } from "date-fns";
import { type Rota } from "@/server/db/schemas";
type SelectedDayProps = {
  date: Date | null;
  diselect: () => void;
  refetchRota: () => void;
  rotaData?: Rota[];
};

export default function SelectedDay({
  date,
  diselect,
  refetchRota,
  rotaData,
}: SelectedDayProps) {
  return (
    <Dialog open={!!date} onOpenChange={diselect}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date && format(date, "dd MMM yyyy")}</DialogTitle>
          <DialogDescription>
            Select staff who is going to be working this day
          </DialogDescription>
        </DialogHeader>

        <StaffStatusSelector
          date={date}
          rotaData={rotaData}
          onComplete={() => {
            refetchRota();
            diselect();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
