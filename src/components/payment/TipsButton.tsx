"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBill from "@/hooks/useBill";
import { cn } from "@/lib/utils";
import { HandCoinsIcon } from "lucide-react";
import { useState } from "react";

type TipsButtonProps = {
  orderId: string;
};
export default function TipsButton({ orderId }: TipsButtonProps) {
  const [show, setShow] = useState(false);
  const [tipValue, setTipValue] = useState<number | null>(null);
  const { addTips } = useBill(orderId);

  const handleClick = async () => {
    if (!tipValue) return;
    setShow(false);
    addTips(tipValue);
  };

  return (
    <>
      {show && (
        <Input
          type="number"
          className="my-4"
          onChange={(e) => setTipValue(+e.target.value)}
          value={tipValue ?? ""}
          autoFocus
        />
      )}
      <div className="flex justify-between gap-2">
        <Button
          onClick={() => setShow((prev) => !prev)}
          variant="outline"
          className={cn("W-full", show && "bg-slate-100 ring-1 ring-green-400")}
        >
          <HandCoinsIcon className="mr-1" /> Tip
        </Button>
        {show && tipValue && (
          <Button className="W-full" onClick={handleClick}>
            Submit
          </Button>
        )}
      </div>
    </>
  );
}
