import { cn } from "@/lib/utils";
import { RotaItem } from "./MonthCalendar";
import { format, isToday } from "date-fns";

type DayCardProps = {
  rotaItem?: RotaItem[];
  day: Date;
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
};

export default function DayCard({
  rotaItem,
  isCurrentMonth,
  day,
  onClick,
}: DayCardProps) {
  const colorMap: Record<string, string> = {
    Morning: "bg-blue-500",
    Evening: "bg-green-500",
  };
  const today = isToday(day);
  return (
    <div
      onClick={() => onClick(day)}
      className={cn(
        "relative cursor-pointer border bg-gray-100 p-1 hover:border-slate-700",
        { "bg-white": isCurrentMonth, "border-slate-700": today },
      )}
    >
      <div className="absolute left-1 top-1 text-sm">{format(day, "d")}</div>
      <div className="mt-5">
        {rotaItem &&
          rotaItem.map((item) => (
            <div className={`${colorMap[item.shift]} rounded p-1 text-xs `}>
              {item.name}
            </div>
          ))}
      </div>
    </div>
  );
}
