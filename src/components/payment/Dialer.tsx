import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useMemo } from "react";

type DialerProps = {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: number;
};

export default function Dialer({ value, setValue }: DialerProps) {
  const dialerNumber = useMemo(() => new Array(9).fill(0).map((_, i) => i + 1), []);
  const roundNumbers = [value, 10, 20, 50];
  return (
    <>
      <div className="grid grid-cols-3 gap-2 max-w-xs w-full">
        {dialerNumber.map((number) => (
          <Button
            onClick={() => setValue((prev) => prev + number.toString())}
            key={number}
            className="w-full"
            variant="outline"
          >
            {number}
          </Button>
        ))}
        <div className="col-span-3 grid grid-cols-4 gap-4">
          <Button onClick={() => setValue((prev) => prev + ".")} className="col-span-1" variant="outline">
            .
          </Button>
          <Button onClick={() => setValue((prev) => prev + "0")} className="col-span-3" variant="outline">
            0
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-24 ml-4">
        {roundNumbers.map((note) => (
          <Button onClick={() => setValue(note.toString())} key={note} className="w-full" size="sm">
            {formatCurrency(note)}
          </Button>
        ))}
      </div>
    </>
  );
}
