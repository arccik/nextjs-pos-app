import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { type Rota } from "@/server/db/schemas";

type DayCardProps = {
  rotaItem?: Rota[];
  day: Date;
  isCurrentMonth: boolean;
  onClick: (date: Date) => void;
  className?: string;
};

export default function DayCard({
  rotaItem,
  isCurrentMonth,
  day,
  onClick,
  className,
}: DayCardProps) {
  const today = isToday(day);
  return (
    <div
      onClick={() => onClick(day)}
      className={cn(
        className,
        "bg-glowing-gradient hover:animate-glow relative min-h-14 cursor-pointer rounded-sm border bg-gray-100 bg-[length:200%_200%] p-1 transition-all duration-300 ease-in-out hover:border-slate-700 hover:bg-slate-200 md:min-h-24 ",
        { "bg-slate-50": isCurrentMonth, "border-slate-700": today },
      )}
    >
      <div className="absolute left-1 top-1 text-sm">{format(day, "d")}</div>
      <div className="mt-5">
        {rotaItem?.map(
          (item) =>
            item.shift && (
              <div
                className={cn("rounded p-1 text-xs", {
                  "bg-blue-500": item?.shift === "morning",
                  "bg-green-500": item?.shift === "evening",
                  "bg-purple-500": item?.shift === "night",
                })}
                key={item.id}
              >
                {item.name}
              </div>
            ),
        )}
      </div>
    </div>
  );
}
