import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type QuantityButtonsProps = {
  onChange: (q: number) => void;
  value: number;
};

export default function QuantityButtons({
  onChange,
  value,
}: QuantityButtonsProps) {
  const handleClick = (operator: "+" | "-") => {
    if (operator === "+") {
      onChange(value + 1);
    } else if (operator === "-" && value > 1) {
      onChange(value - 1);
    }
  };
  return (
    <div className="flex">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleClick("-")}
        disabled={value === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Input
        className="w-12 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        type="number"
        value={value} // You can remove the value prop since it's not being used
        disabled
      />
      <Button variant="outline" size="icon" onClick={() => handleClick("+")}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
