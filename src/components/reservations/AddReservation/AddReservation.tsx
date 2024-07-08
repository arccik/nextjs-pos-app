import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import NewResetvation from "./ResetvationForm";
import { PlusIcon } from "lucide-react";

export default function AddReservation() {
  const [isOpen, setIsOpen] = useState(false);

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
