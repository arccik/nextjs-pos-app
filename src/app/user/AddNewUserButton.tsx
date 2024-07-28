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
import { AddNewUser } from "./AddNewUser";
import { useState } from "react";

export default function AddNewUserButton() {
  const [show, setShow] = useState(false);
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button variant="outline">Add New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Fill up required information below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <AddNewUser onComplete={() => setShow(false)} />
      </DialogContent>
    </Dialog>
  );
}
