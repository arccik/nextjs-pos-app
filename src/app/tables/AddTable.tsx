"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddTableForm from "./AddTableForm";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

export default function AddTable() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <PlusIcon size="1rem" className="mr-1" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" title="add new table">
        <DialogHeader>
          <DialogTitle>Add New Table</DialogTitle>
          <DialogDescription>
            Fill all required fields to create a new table
          </DialogDescription>
        </DialogHeader>
        <AddTableForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
