"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import NewResetvation from "./ReservationForm";
type AddReservationProps = { open?: boolean };
export default function AddReservation({ open }: AddReservationProps) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen((prev) => !prev)}
          size="sm"
        >
          <PlusIcon size="1rem" className="mr-1" /> Add Reservation
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Reservation</DialogTitle>
        </DialogHeader>
        <NewResetvation onComplete={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
