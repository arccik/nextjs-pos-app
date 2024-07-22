"use client";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";
import { api } from "@/trpc/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AddOrderSpecialRequest({
  orderId,
}: {
  orderId: string;
}) {
  const [inputValue, setInputValue] = useState("");

  const addSpecialRequest = api.order.addSpecialRequest.useMutation({
    onSuccess: () => {
      setInputValue("");
      alert('REquest Added!')
    },
  });
  const { data } = api.order.getSpecialRequest.useQuery({ orderId });

  const handleSubmit = () => {
    addSpecialRequest.mutate({ request: inputValue, orderId });
  };

  if (data?.specialRequest) {
    return (
      <CardDescription>
        Ready for pickup. Please deliver to the customer in 5 minutes.
      </CardDescription>
    );
  }
  return (
    <Dialog>
      <DialogTrigger>
        <Button size="sm" className="font-semibold" variant="link">
          Add Special Request
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Special Request</DialogTitle>
          <DialogDescription>
            This will be visible to Other staff members
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
