"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ChooseTable from "./ChooseTable";
import NewCustomerButton from "./NewCustomerButton";
import { useState } from "react";

type NewCustomerProps = {
  buttonTrigger?: React.ReactNode;
};

export default function SelectTable({ buttonTrigger }: NewCustomerProps) {
  const [show, setShow] = useState(false);

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild={!!buttonTrigger}>
        {buttonTrigger ?? <NewCustomerButton />}
      </DialogTrigger>

      <DialogContent className="overflow-hidden !p-0 sm:max-w-[520px] [&>button:last-child]:hidden">
        <div className="flex max-h-[90dvh] flex-col">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold">Select table</h2>
              <p className="text-sm text-muted-foreground">Choose an available table</p>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                <X size={16} />
              </Button>
            </DialogClose>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <ChooseTable close={() => setShow(false)} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
