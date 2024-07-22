import { formatDistanceToNowStrict } from "date-fns";
import { ClockIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export default function CountDownOpenOrder({ date }: { date: Date }) {
  const [minustes, setMinutes] = useState<string | null>(null);

  console.log("CoUNT DOwn: ", date);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newMinutes = formatDistanceToNowStrict(date, {
        addSuffix: true,
      });
      setMinutes(newMinutes);
    }, 600);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex items-center text-right text-sm">
      <ClockIcon className="mr-2 h-6 w-6" />

      <p>{minustes}</p>
    </div>
  );
}
