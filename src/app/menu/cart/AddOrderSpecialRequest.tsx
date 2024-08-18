"use client";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { api } from "@/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Edit, Trash } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  orderId: string;
  request?: string | null;
};

export default function AddOrderSpecialRequest({ orderId, request }: Props) {
  const [inputValue, setInputValue] = useState(request);
  const [showDialog, setShowDialog] = useState(false);

  const addRequest = api.order.addSpecialRequest.useMutation({
    onSuccess: () => {
      setShowDialog(false);
    },
  });

  const removeRequest = api.order.removeSpecialRequest.useMutation({
    onSuccess: () => {
      setShowDialog(false);
      setInputValue(null);
    },
  });

  const handleSave = () => {
    if (!inputValue) return;
    addRequest.mutate({ request: inputValue, orderId });
  };

  const handleDelete = () => {
    removeRequest.mutate(orderId);
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        {inputValue === null ? (
          <Button size="sm" variant="link" className="self-start">
            Add Special Request
          </Button>
        ) : (
          <CardDescription
            className="flex max-w-full gap-1"
            onClick={() => setShowDialog((prev) => !prev)}
          >
            {inputValue} <Edit size="1rem" />
          </CardDescription>
        )}
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Special Request</DialogTitle>
          <DialogDescription>
            This will be visible to Other staff members
          </DialogDescription>
        </DialogHeader>
        <Textarea
          maxLength={100}
          value={inputValue ?? ""}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <DialogFooter>
          <div className="flex gap-4">
            <Button onClick={handleDelete} variant="outline">
              Delete
              <Trash size="sm" className="ml-2" />
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
