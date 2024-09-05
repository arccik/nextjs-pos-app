"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBill from "@/hooks/useBill";
import { useQueryClient } from "@tanstack/react-query";
import { HandCoins, HandCoinsIcon } from "lucide-react";
import { useState } from "react";

type TipsButtonProps = {
  setValue: (amount: number) => void;
  orderId: string;
};
export default function TipsButton({ setValue, orderId }: TipsButtonProps) {
  const [show, setShow] = useState(false);
  const [tipValue, setTipValue] = useState<number | null>(null);
  const { addTips } = useBill(orderId);

  const handleClick = async () => {
    if (!tipValue) return;
    setValue(tipValue);
    setShow(false);
    addTips(tipValue);
  };

  return (
    <>
      {show && (
        <>
          <Input
            type="number"
            onChange={(e) => setTipValue(+e.target.value)}
            value={tipValue ?? ""}
            autoFocus
          />
          {tipValue && <Button onClick={handleClick}>Submit </Button>}
        </>
      )}
      <Button
        onClick={() => setShow((prev) => !prev)}
        variant={show ? "default" : "outline"}
      >
        <HandCoinsIcon className="mr-1" /> Tip
      </Button>
    </>
  );
}
