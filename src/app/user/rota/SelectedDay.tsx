"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type StaffStatus, StaffStatusSelector } from "./StaffSelection";
import { api } from "@/trpc/react";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
type SelectedDayProps = {
  date: Date | null;
  diselect: () => void;
};

export default function SelectedDay({ date, diselect }: SelectedDayProps) {
  return (
    <Dialog open={!!date} onOpenChange={diselect}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date && format(date, "dd MMM yyyy")}</DialogTitle>
          <DialogDescription>
            Select staff who is going to be working this day
          </DialogDescription>
        </DialogHeader>

        <StaffStatusSelector date={date} onComplete={diselect} />
      </DialogContent>
    </Dialog>
  );
}
