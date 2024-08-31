import { cn } from "@/lib/utils";
import { format, isToday } from "date-fns";
import { type Rota } from "@/server/db/schemas";
import { Badge } from "@/components/ui/badge";

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
      role="button"
      onClick={() => isCurrentMonth && onClick(day)}
      className={cn(
        className,
        "bg-glowing-gradient hover:animate-glow 0 relative hidden min-h-14 cursor-pointer flex-wrap rounded-sm border bg-[length:200%_200%] p-1 transition-all duration-300 ease-in-out md:min-h-24 ",
        {
          "block bg-slate-50 dark:bg-slate-950": isCurrentMonth,
          "hover:bg-slate-20 border-slate-700 hover:border-slate-700 dark:border-slate-100":
            today,
        },
      )}
    >
      <div className="absolute left-1 top-1 text-sm">{format(day, "d")}</div>
      <div className="mt-5">
        {rotaItem?.map(
          (item) =>
            item.shift && (
              <Badge
                variant="outline"
                className={cn("rounded p-1 text-xs", {
                  "bg-yellow-400": item?.shift === "morning",
                  "bg-orange-500": item?.shift === "evening",
                  "bg-indigo-600": item?.shift === "night",
                })}
                key={item.id}
              >
                {item.name}
              </Badge>
            ),
        )}
      </div>
    </div>
  );
}
