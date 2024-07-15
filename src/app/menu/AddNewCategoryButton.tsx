"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import AddNewCategory from "./AddNewCategory";
import { useState } from "react";

export default function AddNewCategoryButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Category</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Category to your menu</DialogTitle>
          <DialogDescription>
            Here you can add new category to the menu
          </DialogDescription>
        </DialogHeader>
        <AddNewCategory onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
