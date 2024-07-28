import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { Rota } from "@/server/db/schemas";

type DayCardProps = {
  rotaItem?: Rota[];
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
        "bg-glowing-gradient  hover:animate-glow relative cursor-pointer rounded-sm border bg-gray-100 bg-[length:200%_200%] p-1 transition-all duration-300 ease-in-out hover:border-slate-700 hover:bg-slate-200 ",
        { "bg-slate-50": isCurrentMonth, "border-slate-700": today },
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
