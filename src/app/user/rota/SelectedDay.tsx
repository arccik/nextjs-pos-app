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
  const saveRota = api.rota.saveRota.useMutation({
    onSuccess: () => {
      toast({
        title: "Rota saved successfully",
        description: "The rota has been saved to the database",
      });
    },
  });
  const handleStatusChange = (staffStatus: StaffStatus[]) => {
    if (!date) return;
    saveRota.mutate(staffStatus.map((v) => ({ ...v, date })));
  };

  return (
    <Dialog open={!!date} onOpenChange={diselect}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{date && format(date, "dd MMM yyyy")}</DialogTitle>
          <DialogDescription>
            Select staff who is going to be working this day
          </DialogDescription>
        </DialogHeader>

        <StaffStatusSelector onStatusChange={handleStatusChange} />
      </DialogContent>
    </Dialog>
  );
}
