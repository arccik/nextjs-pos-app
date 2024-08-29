import { formatDistanceToNowStrict } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function CountDownOpenOrder({ date }: { date: Date }) {
  const [minustes, setMinutes] = useState<string | null>(null);


  useEffect(() => {
    if (!date) return;
    const intervalId = setInterval(() => {
      const newMinutes = formatDistanceToNowStrict(date, {
        addSuffix: true,
      });
      setMinutes(newMinutes);
    }, 600);

    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <div className="flex items-center gap-1 text-right text-xs">
      <ClockIcon className="size-5" />

      <p>{minustes}</p>
    </div>
  );
}
